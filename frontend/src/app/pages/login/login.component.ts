// src/app/pages/login/login.component.ts
// ─── Lógica del formulario de login ──────────────

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }     from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // El formulario reactivo
  loginForm!: FormGroup;

  // Estados de la UI
  cargando     = false; // true mientras espera la respuesta
  errorMensaje = '';    // mensaje de error si falla el login
  mostrarPass  = false; // mostrar/ocultar contraseña

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir directamente
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/usuarios']);
      return;
    }

    // Definir el formulario con sus validaciones
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,        // No puede estar vacío
        Validators.minLength(3)     // Mínimo 3 caracteres
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
  }

  // Acceso rápido a los campos del formulario
  get f() { return this.loginForm.controls; }

  // ─── ENVIAR EL FORMULARIO ─────────────────────
  onSubmit(): void {
    // Si el formulario tiene errores → marcar todo y salir
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando     = true;
    this.errorMensaje = '';

    // Llamar al servicio de autenticación
    this.authService.login(
      this.loginForm.value.username,
      this.loginForm.value.password
    ).subscribe({
      next: () => {
        // Login exitoso → ir a la página de usuarios
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        // Login fallido → mostrar error
        this.errorMensaje = err.error?.mensaje || 'Usuario o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }

  toggleMostrarPass(): void {
    this.mostrarPass = !this.mostrarPass;
  }
}