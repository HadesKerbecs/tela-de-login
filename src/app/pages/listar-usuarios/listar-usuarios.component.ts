import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent {
  formAberto: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Usuário não autenticado! Redirecionando para login.');
      this.router.navigate(['/paginaLogin']);
    }
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
  }
}
