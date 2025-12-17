import {
  Body, // Lee el body (JSON) de la petición HTTP
  Controller, // Marca esta clase como un Controller de Nest
  Delete, // Decorador para rutas DELETE
  Get, // Decorador para rutas GET
  Param, // Lee parámetros de ruta: /tickets/:id
  Query, // Lee parámetros de consulta: /tickets?page=2&limit=10
  Patch, // Decorador para rutas PATCH (actualizaciones parciales)
  Post, // Decorador para rutas POST (creación)
  ParseUUIDPipe, // Valida y convierte el parámetro id (exige formato UUID)
} from '@nestjs/common';

import { TicketsService } from './tickets.service'; // Lógica de negocio (habla con Prisma/BD)
import { CreateTicketDto } from './dto/create-ticket.dto'; // Valida estructura para crear
import { UpdateTicketDto } from './dto/update-ticket.dto'; // Valida estructura para actualizar
import { FindTicketsDto } from './dto/find-tickets.dto'; // Valida estructura para buscar/listar

// Prefijo base: todas las rutas serán /tickets/...
@Controller('tickets')
export class TicketsController {
  // Inyección de dependencias:
  // Nest crea una instancia de TicketsService y la entrega aquí.
  constructor(private readonly ticketsService: TicketsService) {}

  // =========================
  // POST /tickets
  // =========================
  // Crea un ticket nuevo.
  // @Body() toma el JSON enviado en el request body y lo mapea a CreateTicketDto.
  @Post()
  create(@Body() dto: CreateTicketDto) {
    // Delegamos a la capa service (controller NO debería tener lógica de BD)
    return this.ticketsService.create(dto);
  }

  // =========================
  // GET /tickets
  // =========================
  // Devuelve la lista de tickets.
  @Get()
  findAll(@Query() query: FindTicketsDto) {
    return this.ticketsService.findAll(query);
  }

  // =========================
  // GET /tickets/:id
  // =========================
  // Devuelve un ticket por ID.
  // @Param('id', new ParseUUIDPipe()) hace 2 cosas:
  // 1) Extrae el valor del parámetro :id
  // 2) Valida que sea UUID; si no lo es -> responde 400 automáticamente
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketsService.findOne(id);
  }

  // =========================
  // PATCH /tickets/:id
  // =========================
  // Actualiza parcialmente: solo los campos enviados en el body se modifican.
  // UpdateTicketDto normalmente tiene todo opcional (titulo?, descripcion?, etc.)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, dto);
  }
  // =========================
  // DELETE /tickets/:id
  // =========================
  // Elimina un ticket por ID.
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ticketsService.remove(id);
  }
}
