import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './core/services/firebase.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFloatComponent } from './shared/components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,FooterComponent, WhatsappFloatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  title = 'imprenta-web';

  // Inyectamos el servicio FirebaseService
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Escribimos un dato de prueba en la ruta 'test/connection'
    this.firebaseService.setData('test/connection', { message: 'Conexión exitosa a Firebase!' })
      .then(() => {
        console.log('✅ Dato escrito correctamente en Firebase Realtime Database.');
        // Leemos el dato para verificarlo
        return this.firebaseService.getDataOnce('test/connection');
      })
      .then((data) => {
        console.log('📦 Dato leído desde Firebase:', data);
      })
      .catch((error) => {
        console.error('❌ Error al conectar con Firebase:', error);
      });
  }
}