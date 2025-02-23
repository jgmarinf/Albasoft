# Gestión de Proyectos y Usuarios

Este proyecto es una aplicación full-stack para la gestión de proyectos y usuarios, construida con:

- **Frontend**: Next.js (TypeScript)
- **Backend**: NestJS (TypeScript)
- **Base de datos**: PostgreSQL

## Requisitos Previos

- Node.js (v18+)
- PostgreSQL (v15+)
- npm (v9+)

## Configuración Inicial

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   ```

2. **Configurar variables de entorno**:
   - Crear archivo `.env.local` en `frontend/`:
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
     NEXTAUTH_SECRET=tu_secreto_aqui
     ```
   - Crear archivo `.env` en `backend/`:
     ```env
     DB_URL_PORT=postgres://usuario:contraseña@localhost:5432/nest_db
     PORT=3001
     JWT_SECRET=tu_secreto_jwt
     ```

3. **Instalar dependencias**:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

## Ejecución Local

1. **Iniciar el backend**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Iniciar el frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Acceder a la aplicación**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001/api

## Estructura del Proyecto

```
.
├── backend/            # NestJS API
│   ├── src/            # Código fuente
│   ├── test/           # Pruebas
│   └── ...            
├── frontend/           # Aplicación Next.js
│   ├── src/            # Código fuente
│   └── ...            
└── README.md           # Este archivo
```

## Configuración de la Base de Datos

La base de datos debe contener las siguientes tablas:

- **Usuarios**: Almacena la información de los usuarios, como nombre, correo electrónico, y rol.
- **Proyectos**: Almacena los detalles de los proyectos, como nombre y descripción.
- **Relación Usuarios-Proyectos**: Una tabla relacional que conecta usuarios con proyectos, permitiendo que un usuario pueda estar asociado a múltiples proyectos y viceversa.

### Relaciones

- Un usuario puede ser administrador de varios proyectos.
- Un proyecto puede tener múltiples usuarios asociados.
- Las configuraciones del ORM en el backend (`src/users/entities/user.entity.ts` y `src/projects/entities/project.entity.ts`) definen estas relaciones usando TypeORM.

Puedes utilizar tu propia base de datos PostgreSQL para ejecutar el proyecto localmente. Asegúrate de que las tablas y relaciones estén configuradas correctamente según las entidades definidas en el backend.

## Despliegue en Producción

Para configurar el servidor en producción, consulta el archivo [SERVER_SETUP.md](backend/SERVER_SETUP.md) que incluye:

- Configuración de EC2
- Despliegue con PM2
- Configuración de Nginx
- Certificado SSL con Let's Encrypt

## Contribución

1. Haz un fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

[MIT](LICENSE)
```

</rewritten_file>
