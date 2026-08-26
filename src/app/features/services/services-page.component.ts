import { Component } from '@angular/core';
import { ServicesSectionComponent } from '../home/components/services-section/services-section.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [ServicesSectionComponent],
  template: '<app-services-section></app-services-section>'
})
export class ServicesPageComponent {}
