import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContactInfo } from '../../../../core/models/site-data.model';
import { DataService } from '../../../../core/services/data.service';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url.pipe';


@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    SafeUrlPipe
  ],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent implements OnInit {
  contactInfo!: ContactInfo;
  loading = true;

  // Datos del formulario
  formData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    company: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(
    private dataService: DataService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.dataService.getContactInfo().subscribe(info => {
      this.contactInfo = info;
      this.loading = false;
    });
  }

  // Enviar formulario: guarda en Firebase y abre WhatsApp
  onSubmit(): void {
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    // Guardar en Firebase (historial de contactos)
    const contactEntry = {
      ...this.formData,
      date: new Date().toISOString(),
      source: 'sitio web'
    };

    this.firebaseService.setData(`contacts/${Date.now()}`, contactEntry)
      .then(() => {
        // Abrir WhatsApp con mensaje predefinido
        this.openWhatsApp();
        this.submitSuccess = true;
        this.isSubmitting = false;
        this.resetForm();
      })
      .catch(error => {
        console.error('Error guardando contacto:', error);
        this.submitError = true;
        this.isSubmitting = false;
        // Aún así abrimos WhatsApp (prioridad a la conversión)
        this.openWhatsApp();
      });
  }

  // Abrir WhatsApp con el mensaje generado
  openWhatsApp(): void {
    const phone = this.contactInfo?.whatsapp || '1234567890';
    const message = `Hola, soy ${this.formData.name || 'un cliente'}. Mi correo es ${this.formData.email || 'no especificado'}. Teléfono: ${this.formData.phone || 'no especificado'}. Mensaje: ${this.formData.message || 'Sin mensaje adicional.'}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  resetForm(): void {
    this.formData = { name: '', email: '', phone: '', message: '', company: '' };
  }
}