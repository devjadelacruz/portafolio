
#### `docs/03_MODELO_DATOS.md`
```md
# Modelo de datos

## ERD inicial
```mermaid
erDiagram
  User {
    string id
    string name
    string email
    datetime createdAt
  }

  Ticket {
    string id
    string title
    string description
    string estado
    string prioridad
    datetime createdAt
    datetime updatedAt
  }
