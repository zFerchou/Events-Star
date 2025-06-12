import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-popular-events',
  imports: [],
  templateUrl: './popular-events.component.html',
  styleUrl: './popular-events.component.css'
})
export class PopularEventsComponent implements OnInit{
  private eventService = inject(EventService);
  public events = this.eventService.eventos;

  ngOnInit(): void {
    this.eventService.cargarEventos();
  }


}
