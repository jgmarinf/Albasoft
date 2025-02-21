# Configuración del Servidor para NestJS en EC2

Este documento describe los pasos necesarios para configurar un servidor EC2 con NestJS, incluyendo la configuración de PM2, DuckDNS, Nginx como proxy inverso y SSL con Let's Encrypt.

## Índice

1. [Configuración Inicial en EC2](#1-configuración-inicial-en-ec2)
2. [Configuración de DuckDNS](#2-configuración-de-duckdns)
3. [Despliegue con PM2](#3-despliegue-con-pm2)
4. [Configuración de Nginx como Proxy Inverso](#4-configuración-de-nginx-como-proxy-inverso)
5. [Configuración de SSL con Let's Encrypt](#5-configuración-de-ssl-con-lets-encrypt)
6. [Gestión del Servidor](#6-gestión-del-servidor)
7. [Consideraciones de Seguridad](#7-consideraciones-de-seguridad)

---

## 1. Configuración Inicial en EC2

### 1.1 Conexión a la instancia

```bash
chmod 400 nestjs-key.pem
ssh -i "nestjs-key.pem" ec2-user@tu-ip-publica
```

### 1.2 Instalación de dependencias base (ejemplo para Ubuntu)

```bash
sudo apt-get update && sudo apt-get upgrade -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
npm install -g @nestjs/cli pm2
```

**Nota:** La versión LTS de Node.js se instalará automáticamente con `nvm install --lts`

### 1.3 Clonar y configurar repositorio

```bash
git clone tu-repo-github.git
cd tu-repo-github/backend
npm install
vi .env # Configurar variables necesarias
```

---

## 2. Configuración de DuckDNS

### 2.1 Instalar dependencias en EC2

```bash
sudo apt update && sudo apt install curl -y
```

### 2.2 Crear script de actualización (/opt/duckdns.sh)

```bash
sudo nano /opt/duckdns.sh
```

Contenido:

```bash
#!/bin/bash
DOMAIN="tudominio"  # Solo el nombre del subdominio (sin .duckdns.org)
TOKEN="tu_token"    # Token de DuckDNS
URL="https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="
curl -s "$URL"
```

### 2.3 Programar actualizaciones cada 5 minutos

```bash
sudo chmod +x /opt/duckdns.sh
sudo crontab -e
```

Agregar al final:

```bash
*/5 * * * * /opt/duckdns.sh >/dev/null 2>&1
```

Verificar configuración:

```bash
sudo crontab -l
```

### 2.4 Opción con Systemd

```bash
sudo nano /etc/systemd/system/duckdns.service
```

Contenido:

```ini
[Unit]
Description=DuckDNS IP Updater
After=network.target

[Service]
ExecStart=/opt/duckdns.sh

[Install]
WantedBy=multi-user.target
```

Habilitar servicio:

```bash
sudo systemctl enable duckdns.service
sudo systemctl start duckdns.service
sudo systemctl status duckdns.service
```

**Ventajas:**

- Reinicios automáticos
- Registro centralizado con journalctl
- Ejecución continua

---

## 3. Despliegue con PM2

### 3.1 Despliegue inicial

```bash
npm run build
pm2 start dist/main.js --name "nestjs-api"
pm2 startup # Sigue las instrucciones que muestra, te dará un comando para ejecutar
# Ejecuta el comando que te da pm2
pm2 save
```

### 3.2 Actualización de la aplicación

```bash
git pull origin main
npm install
npm run build
pm2 restart nestjs-api
```

---

## 4. Configuración de Nginx como Proxy Inverso

### 4.1 Instalación de Nginx

```bash
sudo apt update && sudo apt install nginx -y
```

### 4.2 Configuración del sitio

```bash
sudo nano /etc/nginx/sites-available/tudominio.duckdns.org
```

Contenido:

```nginx
server {
    listen 80;
    server_name tudominio.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4.3 Habilitar y reiniciar Nginx

```bash
sudo ln -s /etc/nginx/sites-available/tudominio.duckdns.org /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 5. Configuración de SSL con Let's Encrypt

### 5.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obtener certificado SSL

**Importante:** Antes de ejecutar este comando, asegúrate de que los puertos 80 (HTTP) y 443 (HTTPS) estén abiertos en el grupo de seguridad de tu instancia EC2. Certbot necesita acceder a estos puertos para verificar el dominio mediante un desafío HTTP.

```bash
sudo certbot --nginx -d tudominio.duckdns.org
```

### 5.3 Verificar configuración Nginx

```bash
sudo nginx -t
```

#### Verificar archivo de configuración

```bash
cat /etc/nginx/sites-available/albasoftapi.duckdns.org
```

#### El archivo de configuración de nginx debería ser algo así

```nginx
server {
    server_name albasoftapi.duckdns.org;
    location / {
        proxy_pass http://localhost:3001; # Puerto de NestJS
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/albasoftapi.duckdns.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/albasoftapi.duckdns.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = albasoftapi.duckdns.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name albasoftapi.duckdns.org;
    return 404; # managed by Certbot
}
```

### 5.4 Verificar renovación automática

Certbot puede usar dos métodos para la renovación automática:

1. **Systemd Timers (método moderno):**

   ```bash
   systemctl list-timers | grep certbot
   ```

   Deberías ver algo como:

   ```bash
   snap.certbot.renew.timer
   ```

2. **Cron Job (método tradicional):**

   ```bash
   sudo crontab -l
   ```

   Deberías ver algo como:

   ```bash
   0 0 */60 * * certbot renew --quiet
   ```

Si no ves ninguno de los dos, puedes configurar manualmente la renovación con:

```bash
sudo certbot renew --dry-run
```

Esto verificará y configurará automáticamente el método de renovación más apropiado para tu sistema.

### 5.5 Reiniciar Nginx

Después de verificar la configuración y la renovación automática, es necesario reiniciar Nginx para aplicar los cambios:

```bash
sudo systemctl restart nginx
```

---

## 6. Gestión del Servidor

### 6.1 Comandos útiles

```bash
# Reinicio completo
sudo reboot

# Gestión PM2
pm2 restart nestjs-api
pm2 stop nestjs-api
pm2 list
pm2 logs
```

### 6.2 Notas importantes

- `pm2 startup` configura persistencia tras reinicios
- `npm run build` requiere script build en package.json
- PM2 maneja ejecución en segundo plano y reinicios

---

## 7. Consideraciones de Seguridad

### 7.1 Configuración de firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 7.2 Actualizaciones de sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 7.3 Protección adicional

- Usar Cloudflare para mitigar DDoS
- Configurar límites de tasa en Nginx
- Habilitar autenticación en API
