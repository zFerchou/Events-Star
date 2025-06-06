import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface City {
  _id?: string;
  name: string;
}

interface ApiResponse<T> {
  status: string;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);

  public ciudades = signal<City[]>([]);
  public ciudadSeleccionada = signal<City | null>(null);
  public cargando = signal(false);
  public error = signal<string | null>(null);

  public totalCiudades = computed(() => this.ciudades().length);

  constructor() {
    //this.cargarCiudades();
  }

  mostrarErrores = effect(() => {
    if (this.error()) {
      console.error('Error en CityService:', this.error());
      alert(this.error());
    }
  });

  cargarCiudades() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<City[]>>(`${environment.apiUrl}/cities`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.ciudades.set(res.data);
            } else {
              this.error.set(res.msg);
            }
            this.cargando.set(false);
          },
          error: (err) => {
            this.error.set(err['error'].msg);
            this.cargando.set(false);
          }
        })
      )
      .subscribe();
  }

  obtenerCiudad(id: string) {
    this.error.set(null);
    this.http.get<ApiResponse<City>>(`${environment.apiUrl}/cities/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.ciudadSeleccionada.set(res.data);
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      )
      .subscribe();
  }

  crearCiudad(data: { name: string }) {
    this.error.set(null);
    return this.http.post<ApiResponse<City>>(`${environment.apiUrl}/cities`, data)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.ciudades.update(list => [res.data, ...list]);
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      );
  }

  actualizarCiudad(id: string, data: { name: string }) {
    this.error.set(null);
    return this.http.put<ApiResponse<City>>(`${environment.apiUrl}/cities/${id}`, data)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.ciudades.update(list => list.map(c => c._id === id ? res.data : c));
              if (this.ciudadSeleccionada()?. _id === id) {
                this.ciudadSeleccionada.set(res.data);
              }
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      );
  }

  eliminarCiudad(id: string) {
    this.error.set(null);
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/cities/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.ciudades.update(list => list.filter(c => c._id !== id));
              if (this.ciudadSeleccionada()?. _id === id) {
                this.ciudadSeleccionada.set(null);
              }
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      );
  }
}
