import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initScrollReveal();
    });
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  private initScrollReveal(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            const section = entry.target.closest('section');
            if (section) {
              section.querySelectorAll('.stagger-item:not(.revealed)').forEach((item, index) => {
                setTimeout(() => item.classList.add('revealed'), index * 100);
              });
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    const observe = () => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
        this.observer!.observe(el);
      });
    };

    setTimeout(observe, 100);
    setTimeout(observe, 1000);
    setTimeout(observe, 2500);
    setTimeout(observe, 5000);
  }
}
