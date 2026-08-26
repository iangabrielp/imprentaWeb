import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from '../../../../core/services/data.service';
import { HeroSection } from '../../../../core/models/site-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDividerModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  heroData: HeroSection | null = null;
  private subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.dataService.getHero().subscribe(data => {
        this.heroData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}