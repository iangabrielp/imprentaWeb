import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { HeroSection } from '../../../../core/models/site-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  heroData: HeroSection | null = null;
  titleLetters: string[] = [];
  private subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.dataService.getHero().subscribe(data => {
        this.heroData = data;
        if (data?.title) {
          this.titleLetters = data.title.split('');
        }
      })
    );
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
