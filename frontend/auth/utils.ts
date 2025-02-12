import argon2 from "argon2-browser";

export async function preHashPassword(password: string): Promise<string> {
  const result = await argon2.hash({
    pass: password,
    salt: window.crypto.getRandomValues(new Uint8Array(16)),
    hashLen: 32,
    time: 2,
    mem: 1024,
  });
  return result.encoded;
}
