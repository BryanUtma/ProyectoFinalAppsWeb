// src/app/services/usuarios.service.ts
// ─── Servicio de comunicación con el backend ──────
// Hace las peticiones HTTP para el CRUD de usuarios

import { Injectable }        from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable }        from 'rxjs';
import { environment }       from '../../../environments/environment';
import { AuthService }       from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class UsuariosService {

  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http:        HttpClient,
    private authService: AuthService
  ) {}

  // ─── HEADERS con token JWT ────────────────────
  // El backend requiere este header en todas las rutas
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ─── VER TODOS ────────────────────────────────
  // GET /api/usuarios
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // ─── VER UNO ──────────────────────────────────
  // GET /api/usuarios/:id
  getOne(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ─── AGREGAR ──────────────────────────────────
  // POST /api/usuarios
  // datos → { username, password, lduser }
  agregar(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos, {
      headers: this.getHeaders()
    });
  }

  // ─── ACTUALIZAR ───────────────────────────────
  // PUT /api/usuarios/:id
  actualizar(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos, {
      headers: this.getHeaders()
    });
  }
} 