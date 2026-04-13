// src/app/pages/usuarios/usuarios.component.ts
// ─── Lógica de la página de usuarios ─────────────

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService }     from '../../services/auth.service';
import { UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class UsuariosComponent implements OnInit {

  // Lista de usuarios de la BD
  usuarios: any[] = [];

  // Estados de la UI
  cargando   = false;
  errorMsg   = '';
  exitoMsg   = '';

  // Control del modal (formulario emergente)
  mostrarModal = false;
  modoEdicion  = false;  // false=agregar, true=editar
  idEditando   = 0;

  // Formulario
  usuarioForm!: FormGroup;

  // Usuario logueado
  usuarioActual: any;

  constructor(
    private fb:              FormBuilder,
    private authService:     AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuario();
    this.initForm();
    this.cargarUsuarios();
  }

  // ─── INICIALIZAR FORMULARIO ───────────────────
  initForm(): void {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      lduser:   [null]
    });
  }

  get f() { return this.usuarioForm.controls; }

  // ─── CARGAR TODOS LOS USUARIOS ────────────────
  cargarUsuarios(): void {
    this.cargando = true;
    this.usuariosService.getAll().subscribe({
      next: (res: any) => {
        this.usuarios = res.usuarios;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar usuarios';
        this.cargando = false;
      }
    });
  }

  // ─── ABRIR MODAL PARA AGREGAR ─────────────────
  abrirAgregar(): void {
    this.modoEdicion = false;
    this.usuarioForm.reset();
    this.mostrarModal = true;
    this.errorMsg = '';
  }

  // ─── ABRIR MODAL PARA EDITAR ──────────────────
  abrirEditar(usuario: any): void {
    this.modoEdicion  = true;
    this.idEditando   = usuario.login_id;
    this.mostrarModal = true;
    this.errorMsg     = '';

    // Cargar datos del usuario en el formulario
    this.usuarioForm.patchValue({
      username: usuario.username,
      password: '',  // No precargamos la contraseña
      lduser:   usuario.lduser
    });
    // La contraseña no es requerida en edición
    this.f['password'].clearValidators();
    this.f['password'].updateValueAndValidity();
  }

  // ─── CERRAR MODAL ─────────────────────────────
  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioForm.reset();
  }

  // ─── GUARDAR (AGREGAR O ACTUALIZAR) ───────────
  guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const datos = this.usuarioForm.value;
    this.cargando = true;

    if (this.modoEdicion) {
      // ACTUALIZAR
      this.usuariosService.actualizar(this.idEditando, datos).subscribe({
        next: () => {
          this.exitoMsg = 'Usuario actualizado correctamente ✅';
          this.cerrarModal();
          this.cargarUsuarios();
          setTimeout(() => this.exitoMsg = '', 3000);
        },
        error: (err: any) => {
          this.errorMsg = err.error?.mensaje || 'Error al actualizar';
          this.cargando = false;
        }
      });
    } else {
      // AGREGAR
      this.usuariosService.agregar(datos).subscribe({
        next: () => {
          this.exitoMsg = 'Usuario agregado correctamente ✅';
          this.cerrarModal();
          this.cargarUsuarios();
          setTimeout(() => this.exitoMsg = '', 3000);
        },
        error: (err: any) => {
          this.errorMsg = err.error?.mensaje || 'Error al agregar';
          this.cargando = false;
        }
      });
    }
  }

  // ─── CERRAR SESIÓN ────────────────────────────
  cerrarSesion(): void {
    this.authService.logout();
  }
}