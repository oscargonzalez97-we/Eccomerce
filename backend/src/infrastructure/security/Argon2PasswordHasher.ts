import argon2 from "argon2";

import { PasswordHasher } from "../../application/ports/PasswordHasher.js";

export class Argon2PasswordHasher
  implements PasswordHasher
{
  async hash(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres"
      );
    }

    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  async compare(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    if (!password || !passwordHash) {
      return false;
    }

    try {
      return await argon2.verify(
        passwordHash,
        password
      );
    } catch {
      return false;
    }
  }
}
