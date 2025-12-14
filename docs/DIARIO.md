# Diario de desarrollo — Portafolio Helpdesk/Ticketing

Este documento registra, día a día, todo lo realizado (comandos, archivos creados, decisiones y verificaciones).

---

## Datos del proyecto

- Repo: `devjadelacruz/portafolio`
- Carpeta local: `C:\Users\JONATHAN\Desktop\portafolio`
- Editor: VS Code
- Terminal: PowerShell
- Stack objetivo:
  - Front: Next.js + TypeScript (pendiente)
  - Back: NestJS + TypeScript ✅ (iniciado)
  - DB: PostgreSQL con Docker ✅
  - ORM: Prisma (pendiente)

---

## Día 1 — Repositorio profesional + conexión a GitHub

### Objetivo
Dejar el repositorio listo (estructura profesional, archivos base, primer commit y conexión a GitHub).

### 1) Configuración inicial de Git (identidad)
> Configura el autor de los commits (solo 1 vez por PC).

```powershell
git config --global user.name "Jonathan CA"
git config --global user.email "dev.jadelacruz@gmail.com"
git config --global --list
cd C:\Users\JONATHAN\Desktop\portafolio
git init
New-Item -ItemType Directory -Force apps\api, apps\web, docs, .github | Out-Null
portafolio/
  apps/
    api/
    web/
  docs/
  .github/

--.gitignore  
node_modules
.env
.env.*
!.env.example
dist
build
.next
out
Thumbs.db
.DS_Store
.vscode

--.editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

--.prettierrc
{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100
}

GitHub CLI  
gh
winget install --id GitHub.cli -e
gh auth login
gh repo create portafolio --public --source=. --remote=origin --description "Portafolio 2025 dic 13"
Notas:
--source=. = “esta carpeta es el proyecto local”
--remote=origin = configura origin apuntando a GitHub
Verificación del remote:

git remote -v


Salida esperada:

origin  https://github.com/devjadelacruz/portafolio.git (fetch)
origin  https://github.com/devjadelacruz/portafolio.git (push)

6) Primer commit y push

git add pasa cambios a “staging”; commit crea un checkpoint; push sube a GitHub.

git add .
git commit -m "chore: estructura inicial del repositorio"
git push -u origin main


✅ Resultado: se ven archivos en GitHub.

Día 2 — PostgreSQL con Docker + NestJS + endpoint /health
Objetivo

Levantar la base de datos local (Docker) y el backend (NestJS) funcionando + endpoint de salud.

Parte A) PostgreSQL con Docker (Docker Compose)
1) Crear docker-compose.yml en la raíz del repo
services:
  db:
    image: postgres:16
    container_name: helpdesk_db
    environment:
      POSTGRES_USER: helpdesk
      POSTGRES_PASSWORD: helpdesk123
      POSTGRES_DB: helpdesk
    ports:
      - "5432:5432"
    volumes:
      - helpdesk_pgdata:/var/lib/postgresql/data

volumes:
  helpdesk_pgdata:


Qué hace:

Descarga y ejecuta Postgres 16

Crea DB helpdesk

Expone puerto 5432 al host

Guarda datos en el volumen helpdesk_pgdata (persistencia)

2) Levantar BD
docker compose up -d


Ver contenedores:

docker ps

3) Probar que la BD responde
docker exec -it helpdesk_db psql -U helpdesk -d helpdesk -c "SELECT NOW();"


✅ Debe devolver fecha/hora.

Parte B) Backend NestJS
1) Crear proyecto Nest dentro de apps/api

npx descarga y ejecuta el CLI en el momento.

cd C:\Users\JONATHAN\Desktop\portafolio\apps
npx @nestjs/cli new api --skip-git --package-manager npm


Notas:

--skip-git evita crear un repo Git dentro de otro repo Git.

2) Levantar el backend
cd api
npm run start:dev


✅ Probar en navegador:

http://localhost:3000 → debe mostrar “Hello World!”

Parte C) Endpoint /health

Archivo: apps/api/src/app.controller.ts

Código final:

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return 'Hello World!';
  }

  @Get('health')
  health() {
    return { ok: true, service: 'api', time: new Date().toISOString() };
  }
}


✅ Probar:

http://localhost:3000/health → devuelve JSON con ok: true

Pendiente (próximo paso del Día 2)

Prisma + conexión a Postgres (DATABASE_URL)

Primera migración (tabla inicial)

Commit de cambios del Día 2 (docker-compose + apps/api + health)

Comandos útiles (rápidos)

Ver estado Git:

git status


Ver historial:

git log --oneline --max-count=10


Bajar servicios Docker:

docker compose down


Levantar servicios Docker:

docker compose up -d


---

## 2) Súbelo al repo (commit + push)
Cuando lo hayas pegado y guardado:

```powershell
git add docs/DIARIO.md
git commit -m "docs: add development log (days 1-2)"
git push

instalar 
nstalar Prisma en el backend
A1) Abre una nueva terminal (no cierres la que está corriendo el servidor)

En VS Code: Terminal → New Terminal

A2) Ve a la carpeta del backend
cd C:\Users\JONATHAN\Desktop\portafolio\apps\api

A3) Instala Prisma
npm i prisma @prisma/client


Qué hace:

prisma = herramienta (CLI) para crear migraciones y generar cliente

@prisma/client = librería que usarás en tu código para consultar la DB

A4) Inicializa Prisma
npx prisma init

Qué crea:

carpeta prisma/ con schema.prisma (tu “modelo” de BD)

archivo .env (donde va la cadena de conexión DATABASE_URL)

✅ Cuando termines este paso, me dices si te creó:

apps/api/prisma/schema.prisma

apps/api/.env


### Cierre del Día 2 (resultado)
✅ PostgreSQL levantado en Docker (helpdesk_db)  
✅ API NestJS funcionando en http://localhost:3000  
✅ Endpoint de salud: http://localhost:3000/health  
✅ Prisma conectado y migración `init` aplicada (tabla User creada)

Comandos de verificación:
```powershell
docker ps
docker exec -it helpdesk_db psql -U helpdesk -d helpdesk -c "SELECT NOW();"
npx prisma migrate status