import { CommonModule } from '@angular/common';
import { Component,inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsT1Service } from '../../services/breadcrumbs-t1.service';

@Component({
  selector: 'app-breadcrumbs-t1',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './breadcrumbs-t1.component.html',
  styleUrl: './breadcrumbs-t1.component.css'
})
export class BreadcrumbsT1Component {
  
  breadService = inject(BreadcrumbsT1Service);
  breadcrumbs = this.breadService.breadcrumbSignal;
  clearHistory(){
    this.breadService.clearHistory();
  }

  

}
