import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceItem, ServiceVariant } from '../../core/models/site-data.model';
import { DataService } from '../../core/services/data.service';
import { ServiceDetailModalComponent } from './service-detail-modal/service-detail-modal.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, ServiceDetailModalComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  services: ServiceItem[] = [];
  loading = true;

  modalOpen = false;
  selectedService: ServiceItem | null = null;
  selectedVariant: ServiceVariant | null = null;

  private observer: IntersectionObserver | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.dataService.getServices().subscribe(services => {
      this.services = services.filter(s => s.enabled !== false);
      this.loading = false;
    });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });

    this.ngZone.runOutsideAngular(() => {
      this.initScrollReveal();
    });
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  openVariant(service: ServiceItem, variant: ServiceVariant): void {
    this.selectedService = service;
    this.selectedVariant = variant;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedService = null;
    this.selectedVariant = null;
  }

  scrollToService(slug: string): void {
    const el = document.getElementById(slug);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private initScrollReveal(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
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
  }
}
