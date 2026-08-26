import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase) { }

  /**
   * Obtiene datos en tiempo real de una ruta específica.
   * @param path Ruta en la base de datos (ej: 'products')
   * @returns Observable con los datos
   */
  getData<T>(path: string): Observable<T | null> {
    return this.db.object<T>(path).valueChanges();
  }

  /**
   * Obtiene una lista de datos en tiempo real (para listas).
   * @param path Ruta en la base de datos (ej: 'products')
   * @returns Observable con un array de datos
   */
  getList<T>(path: string): Observable<T[]> {
    return this.db.list<T>(path).valueChanges();
  }

  /**
   * Establece datos en una ruta (sobrescribe).
   */
  setData(path: string, data: any): Promise<void> {
    return this.db.object(path).set(data);
  }

  /**
   * Actualiza datos en una ruta (parcial).
   */
  updateData(path: string, data: any): Promise<void> {
    return this.db.object(path).update(data);
  }

  /**
   * Elimina datos en una ruta.
   */
  removeData(path: string): Promise<void> {
    return this.db.object(path).remove();
  }

  /**
   * Obtiene datos una sola vez (sin sincronización en tiempo real).
   */
  getDataOnce<T>(path: string): Promise<T | null> {
    return this.db.object<T>(path).query.once('value')
      .then(snapshot => snapshot.val() as T);
  }
}