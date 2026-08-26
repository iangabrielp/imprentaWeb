import { Component } from '@angular/core';
import { AboutSectionComponent } from '../home/components/about-section/about-section.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [AboutSectionComponent],
  template: '<app-about-section></app-about-section>'
})
export class AboutPageComponent {}
