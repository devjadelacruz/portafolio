-- src/main/resources/db/migration/V2__core_schema.sql
-- Esquema core: roles/usuarios/tickets/auditoría

-- Tipos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_prioridad') THEN
CREATE TYPE ticket_prioridad AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE');
END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
CREATE TYPE ticket_status AS ENUM ('ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO');
END IF;
END $$;

-- =========================
-- TABLAS
-- =========================

CREATE TABLE roles (
                     id             BIGSERIAL PRIMARY KEY,
                     nombre         VARCHAR(60)  NOT NULL UNIQUE,
                     descripcion    TEXT,
                     estado         BOOLEAN      NOT NULL DEFAULT TRUE,
                     creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
                     actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_roles_actualizado_en
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION set_actualizado_en();

CREATE TABLE usuarios (
                        id             BIGSERIAL PRIMARY KEY,
                        email          CITEXT       NOT NULL UNIQUE,
                        nombre         VARCHAR(120),
                        password_hash  TEXT         NOT NULL,
                        estado         BOOLEAN      NOT NULL DEFAULT TRUE,
                        creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
                        actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_usuarios_actualizado_en
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION set_actualizado_en();

CREATE TABLE usuario_roles (
                             usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                             rol_id     BIGINT NOT NULL REFERENCES roles(id)    ON DELETE RESTRICT,
                             PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE tickets (
                       id            BIGSERIAL PRIMARY KEY,
                       codigo        VARCHAR(30)  NOT NULL UNIQUE,
                       titulo        VARCHAR(200) NOT NULL,
                       descripcion   TEXT,
                       prioridad     ticket_prioridad NOT NULL DEFAULT 'MEDIA',
                       status        ticket_status    NOT NULL DEFAULT 'ABIERTO',

                       estado        BOOLEAN      NOT NULL DEFAULT TRUE,

                       creado_por    BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
                       asignado_a    BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,

  -- opcional IA / embeddings
                       embedding                 vector(1536),
                       embedding_model           VARCHAR(80),
                       embedding_actualizado_en  TIMESTAMPTZ,

  -- ✅ columna para búsqueda (evita problema IMMUTABLE)
                       search_tsv   TSVECTOR,

                       creado_en     TIMESTAMPTZ  NOT NULL DEFAULT now(),
                       actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
                       cerrado_en    TIMESTAMPTZ
);

CREATE TRIGGER trg_tickets_actualizado_en
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_actualizado_en();

CREATE TABLE ticket_comentarios (
                                  id         BIGSERIAL PRIMARY KEY,
                                  ticket_id  BIGINT NOT NULL REFERENCES tickets(id)  ON DELETE CASCADE,
                                  usuario_id BIGINT      REFERENCES usuarios(id) ON DELETE SET NULL,
                                  mensaje    TEXT   NOT NULL,
                                  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket_adjuntos (
                               id             BIGSERIAL PRIMARY KEY,
                               ticket_id      BIGINT NOT NULL REFERENCES tickets(id)  ON DELETE CASCADE,
                               usuario_id     BIGINT      REFERENCES usuarios(id) ON DELETE SET NULL,
                               nombre_archivo VARCHAR(255) NOT NULL,
                               mime_type      VARCHAR(120),
                               url            TEXT NOT NULL,
                               tamano_bytes   BIGINT,
                               creado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auditoria (
                         id          BIGSERIAL PRIMARY KEY,
                         usuario_id  BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
                         accion      VARCHAR(80) NOT NULL,     -- CREATE_TICKET, UPDATE_TICKET, LOGIN, etc.
                         entidad     VARCHAR(80),              -- TICKET, USUARIO, etc.
                         entidad_id  BIGINT,
                         detalle     JSONB,
                         ip          VARCHAR(60),
                         user_agent  TEXT,
                         creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- TRIGGER: llenar search_tsv
-- =========================

CREATE OR REPLACE FUNCTION tickets_set_search_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_tsv :=
    to_tsvector('spanish', unaccent(coalesce(NEW.titulo,'') || ' ' || coalesce(NEW.descripcion,'')));
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tickets_search_tsv
  BEFORE INSERT OR UPDATE OF titulo, descripcion
                   ON tickets
                     FOR EACH ROW
                     EXECUTE FUNCTION tickets_set_search_tsv();

-- =========================
-- ÍNDICES
-- =========================

CREATE INDEX idx_usuario_roles_usuario ON usuario_roles(usuario_id);
CREATE INDEX idx_usuario_roles_rol     ON usuario_roles(rol_id);

CREATE INDEX idx_tickets_status     ON tickets(status);
CREATE INDEX idx_tickets_prioridad  ON tickets(prioridad);
CREATE INDEX idx_tickets_estado     ON tickets(estado);
CREATE INDEX idx_tickets_asignado   ON tickets(asignado_a);
CREATE INDEX idx_tickets_creado_en  ON tickets(creado_en);

-- ✅ Búsqueda (GIN sobre columna, ya no sobre expresión con unaccent)
CREATE INDEX idx_tickets_search_tsv ON tickets USING GIN (search_tsv);

CREATE INDEX idx_auditoria_usuario   ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_entidad   ON auditoria(entidad);
CREATE INDEX idx_auditoria_creado_en ON auditoria(creado_en);

-- =========================
-- SEED
-- =========================

INSERT INTO roles (nombre, descripcion)
VALUES
  ('ADMIN',   'Administrador del sistema'),
  ('SOPORTE', 'Agente de soporte'),
  ('USUARIO', 'Usuario final')
  ON CONFLICT (nombre) DO NOTHING;
