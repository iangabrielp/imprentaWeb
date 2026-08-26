import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Componentes de las secciones del Home
import { HeroComponent } from './components/hero/hero.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { ClientsSectionComponent } from './components/clients-section/clients-section.component';
import { WebDevSectionComponent } from './components/web-dev-section/web-dev-section.component';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    ServicesSectionComponent,
    ProductsSectionComponent,
    TestimonialsSectionComponent,
    ContactSectionComponent,
    FaqSectionComponent,
    AboutSectionComponent,
    ClientsSectionComponent,
    WebDevSectionComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Aquí podemos agregar lógica para el Home si es necesario
}