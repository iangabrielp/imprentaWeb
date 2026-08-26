import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { WebDevelopmentSection, WebDevServiceItem } from '../../../../core/models/site-data.model';

@Component({
  selector: 'app-web-dev-section',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './web-dev-section.component.html',
  styleUrl: './web-dev-section.component.scss'
})
export class WebDevSectionComponent implements OnInit {
  webDevData: WebDevelopmentSection | null = null;
  services: WebDevServiceItem[] = [];
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getWebDevelopment().subscribe(data => {
      this.webDevData = data;
      this.services = data?.services?.filter(s => s.enabled !== false) || [];
      this.loading = false;
    });
  }
}