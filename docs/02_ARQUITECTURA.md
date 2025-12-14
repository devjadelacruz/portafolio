# Arquitectura

## Estilo
Arquitectura por capas:
- Presentación (Frontend)
- Aplicación (casos de uso/servicios)
- Dominio (reglas del negocio)
- Datos (ORM/BD)

## Diagrama (alto nivel)
```mermaid
flowchart LR
  U[Usuario] --> W[Frontend Web (Next.js)]
  W --> A[API (NestJS)]
  A --> P[Prisma ORM]
  P --> D[(PostgreSQL - Docker)]
