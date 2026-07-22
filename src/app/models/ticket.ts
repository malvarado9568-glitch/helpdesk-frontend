export interface Ticket {
  id?: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  fecha_creacion?: Date;
}
