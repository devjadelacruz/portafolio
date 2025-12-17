import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TicketEstado, TicketPrioridad } from '@prisma/client';

export class FindTicketsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TicketEstado)
  estado?: TicketEstado;

  @IsOptional()
  @IsEnum(TicketPrioridad)
  prioridad?: TicketPrioridad;

  @IsOptional()
  @IsString()
  q?: string;
}
