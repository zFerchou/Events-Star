import { computed, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../../users/services/usuario.service';

export const guardiaCrearGuard: CanActivateFn = (route, state) => {
  const userServ = inject(UsuarioService);
  const ROLE = '4DMlN';
  let user = computed(()=> JSON.parse( userServ.user() || '{}') )

  if(user().role===ROLE){
    return true;
  }
  return false;
};
