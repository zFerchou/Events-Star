import { Routes } from '@angular/router';
import { EventsHomePageComponent } from './pages/events-home-page/events-home-page.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { guardiaCrearGuard } from './guards/guardia-crear.guard';
import { AdminEventsPageComponent } from './pages/admin-events-page/admin-events-page.component';

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
                path: 'all-events',
                component: AdminEventsPageComponent,
                data: {
                    breadcrumb: 'Todos los eventos',
                    icon: 'all-events',
                    description: 'Página para ver todos los eventos ',
                    excludeFromSitemap: true
                }
            },
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
    }
];
