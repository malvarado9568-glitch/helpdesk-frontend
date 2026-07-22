import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista.html',
  styleUrl: './lista.css'
})
export class Lista implements OnInit {

  tickets: any[] = [];

  constructor(
    private ticketService: TicketService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTickets();

    this.ticketService.actualizarLista$.subscribe(() => {
      this.cargarTickets();
    });
  }

  cargarTickets(): void {
    this.ticketService.obtenerTickets().subscribe({
      next: (data) => {
        console.log('Tickets recibidos:', data);

        this.tickets = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
      }
    });
  }

  editarTicket(ticket: any): void {
    this.ticketService.seleccionarTicket(ticket);

    // Llevar la pantalla hacia el formulario.
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarTicket(id: number): void {
    const confirmar = confirm(
      '¿Está segura de que desea eliminar este ticket?'
    );

    if (!confirmar) {
      return;
    }

    this.ticketService.eliminarTicket(id).subscribe({
      next: () => {
        console.log('Ticket eliminado correctamente');
        this.cargarTickets();
      },
      error: (error) => {
        console.error('Error al eliminar el ticket:', error);
        alert('No se pudo eliminar el ticket.');
      }
    });
  }
}