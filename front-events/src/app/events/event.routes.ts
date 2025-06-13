import { Routes } from '@angular/router';
import { EventsHomePageComponent } from './pages/events-home-page/events-home-page.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { guardiaCrearGuard } from './guards/guardia-crear.guard';

export const eventRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'home',
                component: EventsHomePageComponent,
                data: {
                    breadcrumb: 'Home',
                    icon: 'home',
                    description: 'Página de inicio con resumen de contenidos',
                    excludeFromSitemap: true
                }
            },
            {
                path: 'create',
                component: EventFormComponent,
                data: {
                    breadcrumb: 'Publicar Evento',
                    icon: 'create',
                    description: 'Página para publicar un nuevo evento',
                    excludeFromSitemap: true
                },
                canActivate:[guardiaCrearGuard]
            },
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
    }
];
