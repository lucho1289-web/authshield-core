import { pool } from './config/database'; // Ajustá esta ruta a donde tengas tu pool de 'pg'

const initScript = `
-- 1. Tabla de Roles
CREATE TABLE IF NOT EXISTS "roles" (
  "intern_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(30) UNIQUE NOT NULL,
  "description" VARCHAR(255) NOT NULL
);

-- 2. Tabla de Permisos
CREATE TABLE IF NOT EXISTS "permissions" (
  "intern_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(30) UNIQUE NOT NULL,
  "description" VARCHAR(255) NOT NULL
);

-- 3. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS "users" (
  "intern_id" SERIAL PRIMARY KEY,
  "public_id" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  "user_name" VARCHAR(30) UNIQUE NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" VARCHAR(60) NOT NULL,
  "email_verified" BOOLEAN NOT NULL DEFAULT false,
  "blocked_until" TIMESTAMPTZ,
  "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "role_id" INTEGER NOT NULL,
  CONSTRAINT fk_user_role FOREIGN KEY ("role_id") REFERENCES "roles" ("intern_id") DEFERRABLE INITIALLY IMMEDIATE
);

-- 4. Tabla Intermedia Roles-Permisos
CREATE TABLE IF NOT EXISTS "role_permissions" (
  "role_id" INTEGER NOT NULL,
  "permission_id" INTEGER NOT NULL,
  PRIMARY KEY ("role_id", "permission_id"),
  CONSTRAINT fk_rp_role FOREIGN KEY ("role_id") REFERENCES "roles" ("intern_id") DEFERRABLE INITIALLY IMMEDIATE,
  CONSTRAINT fk_rp_permission FOREIGN KEY ("permission_id") REFERENCES "permissions" ("intern_id") DEFERRABLE INITIALLY IMMEDIATE
);

-- 5. Tabla de Refresh Tokens
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "intern_id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "token" VARCHAR(255) UNIQUE NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "expires_at" TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_token_user FOREIGN KEY ("user_id") REFERENCES "users" ("intern_id") DEFERRABLE INITIALLY IMMEDIATE
);

-- 6. Carga inicial de datos esenciales (Sembrado)
INSERT INTO "roles" ("name", "description") 
VALUES 
  ('user', 'Usuario estándar de la plataforma'),
  ('admin', 'Administrador con acceso total')
ON CONFLICT ("name") DO NOTHING;

`;

async function runInit() {
  try {
    console.log('⏳ Creando tablas en la base de datos...');
    await pool.query(initScript);
    console.log('✅ ¡Tablas y roles creados con éxito!');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  } finally {
    await pool.end();
  }
}

runInit();