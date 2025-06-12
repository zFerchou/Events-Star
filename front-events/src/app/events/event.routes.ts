import { Routes } from '@angular/router';
import { EventsHomePageComponent } from './pages/events-home-page/events-home-page.component';

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
                path: '**',
                redirectTo: 'home'
            }
        ]
    }
];
