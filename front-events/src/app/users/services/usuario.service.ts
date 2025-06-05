import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface Usuario {
  _id?: string;
  name: string;
  email: string;
  pass?: string;
  confirmado?: boolean;
}

interface ApiResponse<T> {
  status: string;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  public usuarios = signal<Usuario[]>([]);
  public usuarioSeleccionado = signal<Usuario | null>(null);
  public cargando = signal(false);
  public error = signal<string | null>(null);

  public totalUsuarios = computed(() => this.usuarios().length);

  constructor() {
    //this.cargarUsuarios();
  }

  mostrarErrores = effect(() => {
    if (this.error()) {
      console.error('Error en UsuarioService:', this.error());
      alert(this.error());
    }
  });

  cargarUsuarios() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<Usuario[]>>(`${environment.apiUrl}/users`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarios.set(res.data);
            } else {
              this.error.set(res.msg);
            }
            this.cargando.set(false);
          },
          error: () => {
            this.error.set('Error al cargar usuarios');
            this.cargando.set(false);
          }
        })
      )
      .subscribe();
  }

  registrarUsuario(usuario: { name: string; email: string; pass: string }) {
    this.error.set(null);
    return this.http.post<ApiResponse<{ id: string }>>(
      `${environment.apiUrl}/users/registro`,
      usuario // ← ya no usamos FormData
    ).pipe(
      tap({
        next: (res) => {
          if (res.status !== 'success') {
            this.error.set(res.msg);
          }
        },
        error: () => {
          this.error.set('Error al registrar usuario');
        }
      })
    );
  }


  obtenerUsuario(id: string) {
    this.http.get<ApiResponse<Usuario>>(`${environment.apiUrl}/users/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarioSeleccionado.set(res.data);
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al obtener el usuario');
          }
        })
      )
      .subscribe();
  }

  eliminarUsuario(id: string) {
    this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/users/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarios.update(users => users.filter(u => u._id !== id));
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al eliminar usuario');
          }
        })
      )
      .subscribe();
  }

  editarUsuario(id: string, data: Partial<Usuario>) {
    this.http.put<ApiResponse<Usuario>>(`${environment.apiUrl}/users/${id}`, data)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarios.update(users => users.map(u => u._id === id ? res.data : u));
              if (this.usuarioSeleccionado()?._id === id) {
                this.usuarioSeleccionado.set(res.data);
              }
            } else {
              this.error.set(res.msg);
            }
          },
          error: () => {
            this.error.set('Error al editar usuario');
          }
        })
      )
      .subscribe();
  }

  loginUsuario(email: string, pass: string) {
  this.error.set(null);

  return this.http.post<ApiResponse<Usuario>>(
    `${environment.apiUrl}/users/login`,
    { email, pass },
    {
      withCredentials: true // necesario para que la cookie se guarde
    }
  ).pipe(
    tap({
      next: (res) => {
        if (res.status === 'success') {
          this.usuarioSeleccionado.set(res.data);
        } else {
          this.error.set(res.msg);
        }
      },
      error: () => {
        this.error.set('Error al iniciar sesión');
      }
    })
  );
}

}
