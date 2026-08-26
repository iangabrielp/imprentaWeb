import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
    { path: 'servicios', loadComponent: () => import('./features/services/services-page.component').then(m => m.ServicesPageComponent) },
    { path: 'productos', loadComponent: () => import('./features/products/products-page.component').then(m => m.ProductsPageComponent) },
    { path: 'desarrollo-web', loadComponent: () => import('./features/webdev/webdev-page.component').then(m => m.WebDevPageComponent) },
    { path: 'nosotros', loadComponent: () => import('./features/about/about-page.component').then(m => m.AboutPageComponent) },
    { path: 'contacto', loadComponent: () => import('./features/contact/contact-page.component').then(m => m.ContactPageComponent) },
    { path: '**', redirectTo: '' }
];
