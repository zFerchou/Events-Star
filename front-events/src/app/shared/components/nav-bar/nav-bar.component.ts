import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../users/services/usuario.service';
import { CommonModule } from '@angular/common';
import {
  fromEvent,
  merge,
  Subscription,
  timer,
  interval
} from 'rxjs';
import {
  debounceTime,
  switchMap,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  public ROLE = '4DMlN';
  private USR_KEY = 'usr';
  private userServ = inject(UsuarioService);
  private router = inject(Router);

  public user = computed(() => {
    try {
      return JSON.parse(this.userServ.user() || '{}');
    } catch {
      return {};
    }
  });

  private activityEvents$: Subscription | undefined;
  private timeoutMs = 900000; 
  showTimeoutDialog = signal(false);

  countdown = signal(0); 
  private countdownSubscription: Subscription | null = null;
  private countdownSeconds = 30; 

  private startCountdown() {
    this.countdown.set(this.countdownSeconds);

    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = interval(1000).subscribe(() => {
      const current = this.countdown();
      if (current > 0) {
        this.countdown.set(current - 1);
      } else {
        this.countdownSubscription?.unsubscribe();
        this.onEndSession();
      }
    });
  }

  private stopCountdown() {
    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = null;
  }

  private sessionEffect = effect(() => {
    const usr = this.user();

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
            this.startCountdown(); // ⏱ inicia cuenta regresiva
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
    this.stopCountdown(); // Detiene el contador
    this.ngOnInit(); // Reinicia el contador
  }

  onEndSession() {
    this.showTimeoutDialog.set(false);
    this.stopCountdown(); // Detiene el contador
    this.logout(); // Cierra la sesión
  }

  onEditarClick() {
    const user = this.user();
    if (user && user.email) {
      this.router.navigate(['/users/editar', encodeURIComponent(user.email)]);
    }
  }

  ngOnDestroy(): void {
    this.activityEvents$?.unsubscribe();
    this.stopCountdown();
  }
}
