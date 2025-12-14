import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketPrioridad } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsEnum(TicketPrioridad)
  prioridad?: TicketPrioridad;
}
