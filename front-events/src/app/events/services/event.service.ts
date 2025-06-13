import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface Evento {
  _id?: string;
  eventName: string;
  date: string;
  maxCapacity: number;
  city?: any;
  areaInteres?: any;
  participants?: any[];
  createdBy?: string;
  image?: string;
}

interface ApiResponse<T> {
  status: string;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);

  // Señales para manejar estado
  public eventos = signal<Evento[]>([]);
  public eventoSeleccionado = signal<Evento | null>(null);
  public cargandoEventos = signal(false);
  public error = signal<string | null>(null);

  // Computed para obtener el total de eventos
  public totalEventos = computed(() => this.eventos().length);

  constructor() {
    //this.cargarEventos();
  }

  // Efecto para mostrar errores (ejemplo simple)
  mostrarErrores = effect(() => {
    if (this.error()) {
      console.error('Error en EventService:', this.error());
      // Podrías mostrar notificaciones aquí
      alert(this.error());
    }
  });

  cargarEventos() {
    if (this.cargandoEventos()) return;
    this.cargandoEventos.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<Evento[]>>(`${environment.apiUrl}/events`)
      .pipe(
        tap({
          next: (resp) => {
            if (resp.status === 'success') {
              this.eventos.set(resp.data);
              console.log(this.eventos());
            } else {
              this.error.set(resp.msg);
            }
            this.cargandoEventos.set(false);
          },
          error: (err) => {
            this.error.set(err['error'].msg);
            this.cargandoEventos.set(false);
          }
        })
      )
      .subscribe();
  }

  obtenerEventoPorId(id: string) {
    this.error.set(null);
    this.http.get<ApiResponse<Evento>>(`${environment.apiUrl}/events/${id}`)
      .pipe(
        tap({
          next: (resp) => {
            if (resp.status === 'success') {
              this.eventoSeleccionado.set(resp.data);
            } else {
              this.error.set(resp.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      )
      .subscribe();
  }

  crearEvento(formData: FormData) {
    this.error.set(null);
    return this.http.post<ApiResponse<Evento>>(`${environment.apiUrl}/events`, formData, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            // Agrega el nuevo evento al listado
            this.eventos.update(list => [resp.data, ...list]);
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  editarEvento(id: string, datos: Partial<Evento>) {
    this.error.set(null);
    return this.http.put<ApiResponse<Evento>>(`${environment.apiUrl}/events/${id}`, datos, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            this.eventos.update(list => list.map(ev => ev._id === id ? resp.data : ev));
            if (this.eventoSeleccionado()?._id === id) {
              this.eventoSeleccionado.set(resp.data);
            }
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  eliminarEvento(id: string) {
    this.error.set(null);
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/events/${id}`, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            this.eventos.update(list => list.filter(ev => ev._id !== id));
            if (this.eventoSeleccionado()?._id === id) {
              this.eventoSeleccionado.set(null);
            }
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  agregarParticipante(idEvento: string, idUsuario: string) {
    this.error.set(null);
    return this.http.post<ApiResponse<Evento>>(`${environment.apiUrl}/events/${idEvento}/participantes`, { idUsuario }, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            this.eventos.update(list => list.map(ev => ev._id === idEvento ? resp.data : ev));
            if (this.eventoSeleccionado()?._id === idEvento) {
              this.eventoSeleccionado.set(resp.data);
              console.log(resp);
            }
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    ).subscribe();
  }

  anularReserva(idEvento: string, idUsuario: string){
    this.error.set(null);
    return this.http.delete<ApiResponse<Evento>>(`${environment.apiUrl}/events/${idEvento}/participantes`, {
      body:{ idUsuario },
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            alert('Has anulado tu reservación!')
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    ).subscribe();

  }
}
