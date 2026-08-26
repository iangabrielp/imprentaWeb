import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Control del menú móvil
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Lista de navegación principal
  navItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Productos', link: '/productos' },
    { label: 'Desarrollo Web', link: '/desarrollo-web' },
    { label: 'Nosotros', link: '/nosotros' },
    { label: 'Contacto', link: '/contacto' }
  ];
}