import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalTickets = 0;
  ticketsAbiertos = 0;
  ticketsEnProceso = 0;
  ticketsCerrados = 0;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();

    this.ticketService.actualizarLista$.subscribe(() => {
      this.cargarEstadisticas();
    });
  }

  cargarEstadisticas(): void {
    this.ticketService.obtenerTickets().subscribe({
      next: (tickets: any[]) => {
        this.totalTickets = tickets.length;

        this.ticketsAbiertos = tickets.filter(
          (ticket: any) =>
            ticket.estado?.toLowerCase().trim() === 'abierto'
        ).length;

        this.ticketsEnProceso = tickets.filter(
          (ticket: any) => {
            const estado = ticket.estado?.toLowerCase().trim();

            return estado === 'en proceso' || estado === 'en_proceso';
          }
        ).length;

        this.ticketsCerrados = tickets.filter(
          (ticket: any) =>
            ticket.estado?.toLowerCase().trim() === 'cerrado'
        ).length;
      },

      error: (error: any) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }
}