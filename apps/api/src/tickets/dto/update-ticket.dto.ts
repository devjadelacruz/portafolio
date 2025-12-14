import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketEstado, TicketPrioridad } from '@prisma/client';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(TicketEstado)
  estado?: TicketEstado;

  @IsOptional()
  @IsEnum(TicketPrioridad)
  prioridad?: TicketPrioridad;
}
