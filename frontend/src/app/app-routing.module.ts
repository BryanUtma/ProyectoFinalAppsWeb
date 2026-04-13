
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }       from './pages/login/login.component';
import { UsuariosComponent }    from './pages/usuarios/usuarios.component';
import { AuthGuard }            from './guards/auth.guard';

const routes: Routes = [
  // Ruta raíz → redirige al login
  { path: '',        redirectTo: '/login', pathMatch: 'full' },

  // Página de login (pública, no necesita estar autenticado)
  { path: 'login',    component: LoginComponent },

  // Página de usuarios (protegida → necesita login)
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },

  // Cualquier otra URL → redirige al login
  { path: '**',       redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }