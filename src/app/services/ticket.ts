import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:3000/tickets';

  private actualizarListaSubject = new Subject<void>();

  actualizarLista$ = this.actualizarListaSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerTickets() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearTicket(ticket: any) {
    return this.http.post<any>(this.apiUrl, ticket);
  }

  actualizarTicket(id: number, ticket: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ticket);
  }

  eliminarTicket(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  notificarActualizacion(): void {
    this.actualizarListaSubject.next();
  }
}