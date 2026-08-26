import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { ClientLogo } from '../../../../core/models/site-data.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-clients-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './clients-section.component.html',
  styleUrl: './clients-section.component.scss'
})
export class ClientsSectionComponent implements OnInit {
  clients: ClientLogo[] = [];
  loading = true;
  currentIndex = 0;
  visibleCount = 6; // Número de logos visibles en carrusel

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getClients().subscribe(clients => {
      this.clients = clients.filter(c => c.enabled !== false);
      this.loading = false;
    });
  }

  get visibleClients(): ClientLogo[] {
    if (this.clients.length <= this.visibleCount) {
      return this.clients;
    }
    const start = this.currentIndex % this.clients.length;
    const end = start + this.visibleCount;
    if (end <= this.clients.length) {
      return this.clients.slice(start, end);
    } else {
      const first = this.clients.slice(start);
      const second = this.clients.slice(0, end - this.clients.length);
      return [...first, ...second];
    }
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.clients.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.clients.length) % this.clients.length;
  }
}