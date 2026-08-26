import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { TestimonialItem } from '../../../../core/models/site-data.model';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss'
})
export class TestimonialsSectionComponent implements OnInit {
  testimonials: TestimonialItem[] = [];
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTestimonials().subscribe(testimonials => {
      // Filtramos solo los habilitados (ahora la propiedad existe)
      this.testimonials = testimonials.filter(t => t.enabled !== false);
      this.loading = false;
    });
  }

  // Método para obtener estrellas según rating
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}