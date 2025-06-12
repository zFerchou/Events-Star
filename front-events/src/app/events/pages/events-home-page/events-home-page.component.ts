import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AreasInteresComponent } from '../../components/areas-interes/areas-interes.component';
import { PopularEventsComponent } from '../../components/popular-events/popular-events.component';
import { HeroOrganizadorComponent } from '../../components/hero-organizador/hero-organizador.component';
import { BreadcrumbsT1Service } from '../../../shared/services/breadcrumbs-t1.service';

@Component({
  imports: [
    HeaderComponent,
    AreasInteresComponent,
    PopularEventsComponent,
    HeroOrganizadorComponent,
  ],
  templateUrl: './events-home-page.component.html',
  styleUrl: './events-home-page.component.css'
})
export class EventsHomePageComponent implements OnInit{
  public cookie = '';
  constructor(private breadServices:BreadcrumbsT1Service){
    this.breadServices.clearHistory();
    
  }
  ngOnInit(): void {

  }
}
