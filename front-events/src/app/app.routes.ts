import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'events',
        loadChildren: () => import('./events/event.routes').then(m=>m.eventRoutes)
    },
    {
        path:'users',
        loadChildren:() => import('./users/user.routes').then(m=>m.userRoutes)
    },
    {
        path:'**',
        redirectTo:'events'
    }
];
