import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductItem } from '../../../../core/models/site-data.model';
import { DataService } from '../../../../core/services/data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent,MatIconModule],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss'
})
export class ProductsSectionComponent implements OnInit {
  products: ProductItem[] = [];
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(products => {
      this.products = products.filter(p => p.enabled !== false);
      this.loading = false;
    });
  }
}