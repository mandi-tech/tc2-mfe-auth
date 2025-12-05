import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login';
import { NovoUsuario } from '../novo-usuario/novo-usuario';

const routes: Routes = [
  { path: '', component: Login },
  { path: 'novo-usuario', component: NovoUsuario },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
