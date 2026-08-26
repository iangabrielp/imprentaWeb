import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { FaqItem } from '../../../../core/models/site-data.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss'
})
export class FaqSectionComponent implements OnInit {
  faqs: FaqItem[] = [];
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getFaqs().subscribe(faqs => {
      // Filtrar solo las habilitadas y ordenar por 'order'
      this.faqs = faqs
        .filter(f => f.enabled !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      this.loading = false;
    });
  }
}