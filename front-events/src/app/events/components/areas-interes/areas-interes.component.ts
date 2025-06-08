import { Component, computed, inject, OnInit, Signal } from '@angular/core';

import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Area, AreaService } from '../../../areas/services/area.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-areas-interes',
  imports: [Carousel, ButtonModule],
  templateUrl: './areas-interes.component.html',
  styleUrl: './areas-interes.component.css'
})
export class AreasInteresComponent implements OnInit {
  areasCarrousel = [];
  responsiveOptions: any[] | undefined;
  private areaService = inject(AreaService);
  public areas: Signal<Area[]> = this.areaService.areas;
  public baseURL = environment.apiUrl;
  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }


}
