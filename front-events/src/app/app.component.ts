import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventFormComponent } from './events/components/event-form/event-form.component';
import { RegistroUsuarioComponent } from './users/components/registro-usuario/registro-usuario.component';
import { LoginComponent } from './users/components/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventFormComponent, RegistroUsuarioComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-events';
}
