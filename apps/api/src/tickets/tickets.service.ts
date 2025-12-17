import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FindTicketsDto } from './dto/find-tickets.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE: crea un ticket en BD
  create(dto: CreateTicketDto): Promise<Ticket> {
    return this.prisma.ticket.create({ data: dto });
  }

  // ✅ READ ALL: lista con filtros + paginación + búsqueda
  async findAll(query: FindTicketsDto) {
    // 1) page y limit: si no vienen, usa defaults del DTO
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    // 2) Prisma pagina con skip/take
    const skip = (page - 1) * limit;

    // 3) Construimos el filtro "where" dinámico
    const where: Prisma.TicketWhereInput = {
      // Si query.estado es undefined, Prisma lo ignora
      estado: query.estado,

      // Si query.prioridad es undefined, Prisma lo ignora
      prioridad: query.prioridad,

      // Búsqueda por texto opcional
      ...(query.q
        ? {
            OR: [
              { titulo: { contains: query.q, mode: 'insensitive' } },
              { descripcion: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    // 4) Traemos total + items en una sola transacción (más consistente)
    const [total, items] = await this.prisma.$transaction([
      this.prisma.ticket.count({ where }),
      this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // 5) Devolvemos meta + items
    return {
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      items,
    };
  }

  // ✅ READ ONE: obtener por id (y si no existe, 404)
  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no existe`);
    return ticket;
  }

  // ✅ UPDATE: actualizar por id (si no existe, 404)
  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    await this.findOne(id); // asegura 404 si no existe
    return this.prisma.ticket.update({ where: { id }, data: dto });
  }

  // ✅ DELETE: eliminar por id (si no existe, 404)
  async remove(id: string): Promise<Ticket> {
    await this.findOne(id);
    return this.prisma.ticket.delete({ where: { id } });
  }
}
