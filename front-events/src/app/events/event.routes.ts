import { Routes } from '@angular/router';
import { EventsHomePageComponent } from './pages/events-home-page/events-home-page.component';

export const eventRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'home',
                component:EventsHomePageComponent
            },
            {
                path:'**',
                redirectTo:'home'
            }
        ]
    }
];
