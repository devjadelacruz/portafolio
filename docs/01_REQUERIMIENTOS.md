# Requerimientos — Helpdesk/Ticketing

## Requerimientos funcionales (RF)
RF-01. Registrar ticket: crear un ticket con título, descripción y prioridad.  
RF-02. Listar tickets: mostrar tickets con estado, prioridad y fechas.  
RF-03. Ver ticket: consultar el detalle de un ticket por ID.  
RF-04. Cambiar estado: actualizar estado (NUEVO / EN_PROCESO / RESUELTO / CERRADO).  

## Requerimientos no funcionales (RNF)
RNF-01. Seguridad: credenciales en `.env` (no versionado).  
RNF-02. Mantenibilidad: arquitectura modular por dominio (tickets, auth, etc.).  
RNF-03. Rendimiento: listar tickets < 2s con 500 registros.  
RNF-04. Trazabilidad: commits claros + documentación actualizada.
