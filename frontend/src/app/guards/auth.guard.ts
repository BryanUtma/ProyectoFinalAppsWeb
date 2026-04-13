// src/app/guards/auth.guard.ts
// ─── Guardia de autenticación ─────────────────────
// Si el usuario NO está logueado → redirige al login

import { Injectable }    from '@angular/core';
import { CanActivate }   from '@angular/router';
import { Router }        from '@angular/router';
import { AuthService }   from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  canActivate(): boolean {
    if (this.authService.estaAutenticado()) {
      return true; // Está autenticado → puede acceder
    }

    // No está autenticado → redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}