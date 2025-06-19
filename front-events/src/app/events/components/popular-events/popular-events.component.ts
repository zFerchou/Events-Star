import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Evento, EventService } from '../../services/event.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { UsuarioService } from '../../../users/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popular-events',
  imports: [DatePipe],
  templateUrl: './popular-events.component.html',
  styleUrl: './popular-events.component.css'
})
export class PopularEventsComponent implements OnInit {
  private eventService = inject(EventService);
  private userService = inject(UsuarioService);
  private router = inject(Router);
  public events = computed(() => {
    let evts = this.eventService.eventos().map(ev => {
      ev.reservated = this.isUserParticipant(ev);
      console.log(ev);
      return ev;
    })

    return evts;
  });

  public active = computed(() => {
    let usAct = JSON.parse(this.userService.user() || '{}');
    //console.log(usAct);
    return usAct;
  })
  public reservated = signal(true);

  ngOnInit(): void {
    this.eventService.cargarEventos();
    //console.log(this.active());
  }

  reservation(id: string, item: Evento) {
    //this.usr = this.userService.user();
    console.log(this.active());
    //Valida que el usurio tenga sesion iniciada
    if (Object.keys(this.active()).length === 0) {
      this.router.navigate(['/users/login']);
      return;
    }

    //Registrar al evento
    const { _id: idUsuario } = this.active();
    console.log(id, idUsuario);
    this.eventService.agregarParticipante(id, idUsuario).subscribe(() => {
      this.ngOnInit()
    });


  }


  anularReservacion(id: string, item: Evento) {
    const { _id: idUsuario } = this.active();
    this.eventService.anularReserva(id, idUsuario).subscribe(() => {
      this.ngOnInit()
    });


  }

  isUserParticipant(event: Evento) {
    const reserv = event.participants?.some(p => p._id === this.active()._id) || false;
    //console.log(reserv);
    return reserv;
  }

}
