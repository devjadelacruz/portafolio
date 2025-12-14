
# Portafolio - Helpdesk/Ticketing

Sistema web para registrar y gestionar tickets de soporte (mesa de ayuda).

## Stack
- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- DB: PostgreSQL (Docker)
- ORM: Prisma

## Estructura
- apps/web: Frontend
- apps/api: Backend
- docs: Documentación y capturas

## Roadmap MVP
- [ ] Auth (JWT) + roles
- [ ] CRUD Tickets
- [ ] Estados (Nuevo/En proceso/Resuelto/Cerrado)
- [ ] Comentarios por ticket
- [ ] Dashboard básico

## Cómo ejecutar en local (Día 2)

### 1) Levantar PostgreSQL (Docker)
```bash
docker compose up -d
docker ps
