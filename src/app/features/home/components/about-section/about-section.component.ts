import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { AboutSection } from '../../../../core/models/site-data.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent implements OnInit {
  about!: AboutSection;
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAbout().subscribe(about => {
      this.about = about;
      this.loading = false;
    });
  }
}