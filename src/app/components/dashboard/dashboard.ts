import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

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

  totalTickets: number = 0;
  ticketsAbiertos: number = 0;
  ticketsEnProceso: number = 0;
  ticketsCerrados: number = 0;

  constructor(
    private ticketService: TicketService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();

    this.ticketService.actualizarLista$.subscribe(() => {
      this.cargarEstadisticas();
    });
  }

  cargarEstadisticas(): void {
    this.ticketService.obtenerTickets().subscribe({

      next: (tickets: any[]) => {
        console.log('Tickets recibidos en Dashboard:', tickets);

        if (!Array.isArray(tickets)) {
          console.error('La respuesta del servidor no es una lista:', tickets);
          return;
        }

        this.totalTickets = tickets.length;

        this.ticketsAbiertos = tickets.filter((ticket: any) => {
          const estado = String(ticket.estado || '')
            .toLowerCase()
            .trim();

          return estado === 'abierto';
        }).length;

        this.ticketsEnProceso = tickets.filter((ticket: any) => {
          const estado = String(ticket.estado || '')
            .toLowerCase()
            .trim();

          return (
            estado === 'en proceso' ||
            estado === 'en_proceso' ||
            estado === 'en-proceso'
          );
        }).length;

        this.ticketsCerrados = tickets.filter((ticket: any) => {
          const estado = String(ticket.estado || '')
            .toLowerCase()
            .trim();

          return estado === 'cerrado';
        }).length;

        console.log('Total:', this.totalTickets);
        console.log('Abiertos:', this.ticketsAbiertos);
        console.log('En proceso:', this.ticketsEnProceso);
        console.log('Cerrados:', this.ticketsCerrados);

        this.changeDetector.detectChanges();
      },

      error: (error: any) => {
        console.error('Error al cargar las estadísticas:', error);

        this.totalTickets = 0;
        this.ticketsAbiertos = 0;
        this.ticketsEnProceso = 0;
        this.ticketsCerrados = 0;

        this.changeDetector.detectChanges();
      }

    });
  }
}