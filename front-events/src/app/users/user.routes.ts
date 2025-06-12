import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { guardiaLoginGuard } from './guards/guardia-login.guard';

export const userRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent,
                data: {
                    breadcrumb: 'Iniciar Sesión',
                    icon: 'home',
                    description: 'Página de inicio con resumen de contenidos',
                    excludeFromSitemap: true
                },
                canActivate:[guardiaLoginGuard]
            },
            {
                path: 'signup',
                component: RegistroUsuarioComponent,
                data: {
                    breadcrumb: 'Crear Cuenta',
                    icon: 'home',
                    description: 'Página de inicio con resumen de contenidos',
                    excludeFromSitemap: true
                }
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    }
];
