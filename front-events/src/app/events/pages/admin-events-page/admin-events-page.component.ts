import { Component, computed, inject } from '@angular/core';
import { UsuarioService } from '../../../users/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  templateUrl: './admin-events-page.component.html',
  styleUrl: './admin-events-page.component.css'
})
export class AdminEventsPageComponent {
  private userServ = inject(UsuarioService);
  private router = inject(Router);

  public ROLE = '4DMlN';
  public usr = computed(() => {
    let usr = JSON.parse(this.userServ.user() || '{}');
    return usr;
  })
  
  reservar() {
    if( Object.keys( this.usr() ).length===0){
      this.router.navigate(['/users/login'])
    }
  }

}
