import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // Año actual para el copyright
  currentYear = new Date().getFullYear();

  // Enlaces rápidos
  quickLinks = [
    { label: 'Inicio', link: '/' },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Productos', link: '/productos' },
    { label: 'Nosotros', link: '/nosotros' },
    { label: 'Contacto', link: '/contacto' }
  ];

  // Redes sociales
  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
    { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' }
  ];

  // Contacto
  contactInfo = {
    address: 'Av. Principal 123, Ciudad, País',
    phone: '+123 456 7890',
    email: 'info@imprentaweb.com',
    whatsapp: '+123 456 7890'
  };
}