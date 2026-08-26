import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '',loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)},
    // Ruta comodín para 404 (la añadiremos después)
    { path: '**', redirectTo: '' }
];
