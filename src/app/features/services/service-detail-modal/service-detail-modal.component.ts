import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServiceItem, ServiceVariant } from '../../../core/models/site-data.model';

@Component({
  selector: 'app-service-detail-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './service-detail-modal.component.html',
  styleUrl: './service-detail-modal.component.scss'
})
export class ServiceDetailModalComponent {
  @Input() service!: ServiceItem;
  @Input() variant!: ServiceVariant;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  openWhatsApp(): void {
    const message = encodeURIComponent(
      `Hola, me interesa el servicio de "${this.service.name}" - Variante: "${this.variant.name}" a $${this.variant.price}. ¿Podrían darme más información?`
    );
    window.open(`https://wa.me/525512345678?text=${message}`, '_blank');
  }
}
