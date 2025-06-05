import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface Area {
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
export class AreaService {
  private http = inject(HttpClient);

  public areas = signal<Area[]>([]);
  public areaSeleccionada = signal<Area | null>(null);
  public cargando = signal(false);
  public error = signal<string | null>(null);

  public totalAreas = computed(() => this.areas().length);

  constructor() {
    this.cargarAreas();
  }

  mostrarErrores = effect(() => {
    if (this.error()) {
      console.error('Error en AreaService:', this.error());
      alert(this.error());
    }
  });

  cargarAreas() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<Area[]>>(`${environment.apiUrl}/areas`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.areas.set(res.data);
            } else {
              this.error.set(res.msg);
            }
            this.cargando.set(false);
          },
          error: () => {
            this.error.set('Error al cargar áreas');
            this.cargando.set(false);
          }
        })
      )
      .subscribe();
  }

  obtenerArea(id: string) {
    this.error.set(null);
    this.http.get<ApiResponse<Area>>(`${environment.apiUrl}/areas/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.areaSeleccionada.set(res.data);
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al obtener el área');
          }
        })
      )
      .subscribe();
  }

  crearArea(data: { name: string }) {
    this.error.set(null);
    return this.http.post<ApiResponse<Area>>(`${environment.apiUrl}/areas`, data)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.areas.update(list => [res.data, ...list]);
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al crear área');
          }
        })
      );
  }

  actualizarArea(id: string, data: { name: string }) {
    this.error.set(null);
    return this.http.put<ApiResponse<Area>>(`${environment.apiUrl}/areas/${id}`, data)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.areas.update(list => list.map(a => a._id === id ? res.data : a));
              if (this.areaSeleccionada()?. _id === id) {
                this.areaSeleccionada.set(res.data);
              }
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al actualizar área');
          }
        })
      );
  }

  eliminarArea(id: string) {
    this.error.set(null);
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/areas/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.areas.update(list => list.filter(a => a._id !== id));
              if (this.areaSeleccionada()?. _id === id) {
                this.areaSeleccionada.set(null);
              }
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al eliminar área');
          }
        })
      );
  }
}
