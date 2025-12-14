import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketEstado } from '@prisma/client';

@Injectable()
export class TicketsService {
  // PrismaService = tu “puerta” a la BD (ticket, user, etc.)
  constructor(private readonly prisma: PrismaService) {}

  // Crear ticket
  create(dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        prioridad: dto.prioridad, // si no viene, Prisma usa el default MEDIA
        // estado no lo mandamos => default NUEVO
      },
    });
  }

  // Listar tickets
  findAll() {
    return this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtener 1 ticket por id
  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket no encontrado: ${id}`);
    return ticket;
  }

  // Actualizar parcialmente
  async update(id: string, dto: UpdateTicketDto) {
    // Si no existe, lanzamos 404 bonito
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...dto, // titulo/descripcion/estado/prioridad (solo lo que venga)
      },
    });
  }

  // Cerrar ticket (acción de negocio)
  async close(id: string) {
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: { estado: TicketEstado.CERRADO },
    });
  }
}
