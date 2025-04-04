import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastrarUsuariosComponent } from './pages/cadastrar-usuarios/cadastrar-usuarios.component';
import { ListarUsuariosComponent } from './pages/listar-usuarios/listar-usuarios.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'paginaLogin',
    pathMatch: 'full'
  },
  {
    path: 'paginaLogin',
    component: LoginComponent
  },
  {
    path: 'listar-usuarios',
    component: ListarUsuariosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cadastrar-usuarios',
    component: CadastrarUsuariosComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
