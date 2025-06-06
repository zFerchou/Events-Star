import { Component } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AreasInteresComponent } from '../../components/areas-interes/areas-interes.component';
import { PopularEventsComponent } from '../../components/popular-events/popular-events.component';

@Component({
  imports: [NavBarComponent,HeaderComponent,AreasInteresComponent,PopularEventsComponent],
  templateUrl: './events-home-page.component.html',
  styleUrl: './events-home-page.component.css'
})
export class EventsHomePageComponent {

}
