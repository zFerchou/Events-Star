import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../users/services/usuario.service';
import {
  fromEvent,
  merge,
  Subscription,
  timer
} from 'rxjs';
import {
  debounceTime,
  switchMap,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  public ROLE = '4DMlN';
  private USR_KEY = 'usr';
  private userServ = inject(UsuarioService);
  public user = computed(() => {
    let usr = JSON.parse(this.userServ.user() || '{}');
    return usr;
  });

  private activityEvents$: Subscription | undefined;
  private timeoutMs = 1 * 60 * 1000; // 15 minutos
  showTimeoutDialog = signal(false); // para mostrar u ocultar el modal

  private sessionEffect = effect(() => {
    const usr = this.user();

    // Limpia suscripción anterior
    this.activityEvents$?.unsubscribe();

    if (Object.keys(usr).length > 0) {
      console.log('Usuario activo, se habilita detección de inactividad');

      const mouseMove$ = fromEvent(document, 'mousemove');
      const click$ = fromEvent(document, 'click');
      const keydown$ = fromEvent(document, 'keydown');

      const activity$ = merge(mouseMove$, click$, keydown$);

      this.activityEvents$ = activity$
        .pipe(
          debounceTime(500),
          switchMap(() => timer(this.timeoutMs)),
          tap(() => {
            this.showTimeoutDialog.set(true);
          })
        )
        .subscribe();
    } else {
      console.log('Usuario no activo, no se escucha actividad');
    }
  });

  ngOnInit(): void {
    console.log(this.user());

  }


  logout() {
    window.sessionStorage.removeItem(this.USR_KEY);
    this.userServ.user.set(null);
    this.userServ.usuarioSeleccionado.set(null);
    this.userServ.logout().subscribe(res => console.log(res));
  }

  onExtendSession() {
    this.showTimeoutDialog.set(false);
    this.ngOnInit(); // reinicia el contador
  }

  onEndSession() {
    this.showTimeoutDialog.set(false);
    this.logout();
  }

  ngOnDestroy(): void {
    this.activityEvents$?.unsubscribe();
  }
}


