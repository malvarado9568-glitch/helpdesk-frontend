import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {

  ticket = {
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: ''
  };

  mensaje = '';

  constructor(private ticketService: TicketService) {}

  guardarTicket(): void {

    if (
      !this.ticket.titulo ||
      !this.ticket.descripcion ||
      !this.ticket.categoria ||
      !this.ticket.prioridad
    ) {
      this.mensaje = 'Por favor, complete todos los campos.';
      return;
    }

    this.ticketService.crearTicket(this.ticket).subscribe({
      next: (respuesta) => {
        console.log('Ticket guardado:', respuesta);

        this.mensaje = 'Ticket guardado correctamente.';

        this.ticketService.notificarActualizacion();

        this.ticket = {
          titulo: '',
          descripcion: '',
          categoria: '',
          prioridad: ''
        };
      },
      error: (error) => {
        console.error('Error al guardar el ticket:', error);
        this.mensaje = 'No se pudo guardar el ticket.';
      }
    });
  }
}