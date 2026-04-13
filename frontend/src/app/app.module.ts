import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS }  from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule }   from './app-routing.module';
import { AppComponent }       from './app.component';

// Páginas
import { LoginComponent }     from './pages/login/login.component';
import { UsuariosComponent }  from './pages/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,      // Para hacer peticiones HTTP al backend
    ReactiveFormsModule,   // Para formularios reactivos
    FormsModule,           // Para ngModel
    LoginComponent,
    UsuariosComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }