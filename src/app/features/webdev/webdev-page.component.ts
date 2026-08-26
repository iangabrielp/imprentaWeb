import { Component } from '@angular/core';
import { WebDevSectionComponent } from '../home/components/web-dev-section/web-dev-section.component';

@Component({
  selector: 'app-webdev-page',
  standalone: true,
  imports: [WebDevSectionComponent],
  template: '<app-web-dev-section></app-web-dev-section>'
})
export class WebDevPageComponent {}
