import { Component } from '@angular/core';
import { ProductsSectionComponent } from '../home/components/products-section/products-section.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductsSectionComponent],
  template: '<app-products-section></app-products-section>'
})
export class ProductsPageComponent {}
