import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../core/services/data.service';
import { ContactInfo } from '../../../core/models/site-data.model';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './whatsapp-float.component.html',
  styleUrl: './whatsapp-float.component.scss'
})
export class WhatsappFloatComponent implements OnInit {
  phoneNumber = '1234567890'; // fallback
  message = '¡Hola! Me gustaría recibir información sobre sus servicios.';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getContactInfo().subscribe(info => {
      if (info && info.whatsapp) {
        this.phoneNumber = info.whatsapp;
      }
    });
  }

  openWhatsApp(): void {
    const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.message)}`;
    window.open(url, '_blank');
  }
}