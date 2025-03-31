import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CadastroRequest } from 'src/app/hooks/dados';
import { ValidacaoService } from '../validacao.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent {
  formAberto: boolean = false;
  usuarios$: Observable<CadastroRequest[]>;
  usuarioForm: any;

  constructor(
    private router: Router,
    private service: ValidacaoService
  ) {this.usuarios$ = this.service.usuarios$}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Usuário não autenticado! Redirecionando para login.');
      this.router.navigate(['/paginaLogin']);
    }

    this.service.listar();
  }

  
  editarUsuario(): void {
    if(this.usuarioForm.valid) {
      const usuarioEditado: CadastroRequest = this.usuarioForm.value;
      this.service.editar(usuarioEditado, true)
      this.usuarioCadastrado.emit(usuarioEditado);
    }
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
  }

  atualizarLista(novoUsuario: CadastroRequest) {
    this.usuarios.push(novoUsuario);
  }
}
