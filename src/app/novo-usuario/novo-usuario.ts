import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-novo-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-usuario.html',
  styleUrls: ['./novo-usuario.scss', '../app.scss'],
})
export class NovoUsuario {
  username = '';
  email = '';
  password = '';
  loading = false;

  constructor(private router: Router, private auth: Auth) {}

  criaNovoUsuario() {
    if (!this.email || !this.password || !this.username) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    this.loading = true;

    this.auth
      .postUser({ username: this.username, email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.loading = false;
          alert('Usuário criado com sucesso! Agora você pode fazer login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Erro ao criar usuário', err);
          alert('Falha ao criar usuário. Por favor, tente novamente.');
        },
      });
  }
}
