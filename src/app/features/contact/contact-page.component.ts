import { Component } from '@angular/core';
import { ContactSectionComponent } from '../home/components/contact-section/contact-section.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ContactSectionComponent],
  template: '<app-contact-section></app-contact-section>'
})
export class ContactPageComponent {}
