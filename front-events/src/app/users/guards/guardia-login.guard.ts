import { computed, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

export const guardiaLoginGuard: CanActivateFn = (route, state) => {
  const userServ = inject(UsuarioService);
  let user = computed(()=>userServ.user())
  if(user()){
    return false;
  }
  return true;
};
