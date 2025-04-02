import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CadastroRequest } from 'src/app/hooks/dados';
import { ValidacaoService } from '../validacao.service';
import { CadastrarUsuariosComponent } from '../cadastrar-usuarios/cadastrar-usuarios.component';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent implements OnInit {
  @ViewChild(CadastrarUsuariosComponent) cadastroUsuario!: CadastrarUsuariosComponent;
  formAberto: boolean = false;
  usuarios$: Observable<CadastroRequest[]>;
  detalhesVisiveis: Set<number> = new Set();

  constructor(
    private router: Router,
    private service: ValidacaoService
  ) {
    this.usuarios$ = this.service.usuarios$;
  }

  ngOnInit(): void {
    this.service.listar();
  }

  logout(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/paginaLogin'])
  }

  editarUsuario(usuario: CadastroRequest): void {
    this.formAberto = true;
    setTimeout(() => {
      if (this.cadastroUsuario) {
        this.cadastroUsuario.abrirModalParaEdicao(usuario);
      } else {
        console.error("Erro: cadastroUsuario ainda não foi inicializado.");
      }
    });
  }

  mostrarOuEsconderFormulario(): void {
    this.formAberto = !this.formAberto;
  }

  atualizarLista(novoUsuario: CadastroRequest): void {
    this.service.cadastrar(novoUsuario);
  }

  verMais(id:number): void {
    if(this.detalhesVisiveis.has(id)) {
      this.detalhesVisiveis.delete(id);
    } else {
      this.detalhesVisiveis.add(id);
    }
  }
}