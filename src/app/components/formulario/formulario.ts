import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario implements OnInit {

  ticket = {
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: '',
    estado: 'Abierto'
  };

  mensaje = '';
  ticketIdEditar: number | null = null;
  modoEdicion = false;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.ticketSeleccionado$.subscribe((ticket: any) => {

      if (!ticket) {
        return;
      }

      this.ticketIdEditar = ticket.id;
      this.modoEdicion = true;
      this.mensaje = 'Editando el ticket número ' + ticket.id;

      this.ticket = {
        titulo: ticket.titulo || '',
        descripcion: ticket.descripcion || '',
        categoria: ticket.categoria || '',
        prioridad: ticket.prioridad || '',
        estado: ticket.estado || 'Abierto'
      };
    });
  }

  guardarTicket(): void {
    if (
      !this.ticket.titulo.trim() ||
      !this.ticket.descripcion.trim() ||
      !this.ticket.categoria ||
      !this.ticket.prioridad ||
      !this.ticket.estado
    ) {
      this.mensaje = 'Por favor, complete todos los campos.';
      return;
    }

    if (this.modoEdicion && this.ticketIdEditar !== null) {
      this.actualizarTicket();
    } else {
      this.crearTicket();
    }
  }

  crearTicket(): void {
    this.ticketService.crearTicket(this.ticket).subscribe({
      next: (respuesta: any) => {
        console.log('Ticket guardado:', respuesta);

        this.limpiarFormulario();
        this.mensaje = 'Ticket guardado correctamente.';
        this.ticketService.notificarActualizacion();
      },

      error: (error: any) => {
        console.error('Error al guardar el ticket:', error);
        this.mensaje = 'No se pudo guardar el ticket.';
      }
    });
  }

  actualizarTicket(): void {
    if (this.ticketIdEditar === null) {
      return;
    }

    this.ticketService
      .actualizarTicket(this.ticketIdEditar, this.ticket)
      .subscribe({
        next: (respuesta: any) => {
          console.log('Ticket actualizado:', respuesta);

          this.limpiarFormulario();
          this.mensaje = 'Ticket actualizado correctamente.';
          this.ticketService.notificarActualizacion();
        },

        error: (error: any) => {
          console.error('Error al actualizar el ticket:', error);
          this.mensaje = 'No se pudo actualizar el ticket.';
        }
      });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = 'Edición cancelada.';
  }

  limpiarFormulario(): void {
    this.ticket = {
      titulo: '',
      descripcion: '',
      categoria: '',
      prioridad: '',
      estado: 'Abierto'
    };

    this.ticketIdEditar = null;
    this.modoEdicion = false;
  }
}