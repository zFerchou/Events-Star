import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../users/services/usuario.service';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  public ROLE = '4DMlN';
  private USR_KEY = 'usr';
  private userServ = inject(UsuarioService);
  public user = computed(() => {
    let usr = JSON.parse( this.userServ.user() || '{}');
    return usr;
  });


  ngOnInit(): void {
    console.log(this.user());
  }

  logout() {
    window.sessionStorage.removeItem(this.USR_KEY);
    this.userServ.user.set(null);
    this.userServ.usuarioSeleccionado.set(null);
  }
}


