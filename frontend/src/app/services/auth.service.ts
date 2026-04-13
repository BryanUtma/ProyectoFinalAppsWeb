// src/app/services/auth.service.ts
// ─── Servicio de autenticación ────────────────────
// Maneja login, logout y el token JWT

import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Router }        from '@angular/router';
import { Observable }    from 'rxjs';
import { tap }           from 'rxjs/operators';
import { environment }   from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // URL del backend (viene de environment.ts)
  private apiUrl = environment.apiUrl;

  constructor(
    private http:   HttpClient,
    private router: Router
  ) {}

  // ─── HACER LOGIN ──────────────────────────────
  // Llama a: POST http://localhost:3000/api/auth/login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((respuesta: any) => {
          // Guardar el token en localStorage del navegador
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        })
      );
  }

  // ─── CERRAR SESIÓN ────────────────────────────
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  // ─── ¿ESTÁ AUTENTICADO? ───────────────────────
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
    // !! convierte el valor a true/false
  }

  // ─── OBTENER EL TOKEN ─────────────────────────
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ─── OBTENER USUARIO ACTUAL ───────────────────
  getUsuario(): any {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }
}