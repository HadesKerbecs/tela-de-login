import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { CadastroRequest, CadastroResponse } from '../hooks/dados';
import { ConsultaAPICadastroService } from './consulta-api.service';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoService implements OnInit {
  private usuariosCadastrados = new BehaviorSubject<CadastroRequest[]>([]);
  usuarios$ = this.usuariosCadastrados.asObservable();

  constructor(
    private http: HttpClient,
    private consultaAPICadastroService: ConsultaAPICadastroService,
  ) {}

  ngOnInit() {
    this.listar();
  }

  listar(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ Erro: Token não encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.consultaAPICadastroService.apiUrl}?limit=580`;
    console.log('📡 Enviando requisição GET para:', url);

    this.http.get<CadastroResponse>(url, { headers }).subscribe({
      next: (response) => {
        const novosUsuarios = response.itens || response || [];
        this.usuariosCadastrados.next(novosUsuarios);
        console.log('✅ Lista atualizada:', novosUsuarios);
      },
      error: (err) => {
        console.error('❌ Erro ao listar usuários:', err);
      }
    });
  }

  cadastrar(usuario: CadastroRequest): void {
    if (!usuario.cadastro_tipo_id) {
      usuario.cadastro_tipo_id = 2;
    }

    this.consultaAPICadastroService.cadastrarUsuario(usuario).pipe(
      catchError(error => {
        console.error('❌ Erro no cadastro:', error);
        alert('Erro ao cadastrar. Verifique o console para detalhes.');
        return throwError(() => error);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.id) {
          console.log('✅ Cadastro realizado com sucesso! ID:', response.id);
          this.listar();
        } else {
          console.warn('⚠️ Resposta inesperada da API:', response);
        }
      }
    });
  }

  editar(usuario: CadastroRequest): void {
    if (!usuario.id) {
      console.error('❌ Erro: ID do usuário é obrigatório para edição.');
      return;
    }

    console.log("📤 Chamando editarUsuario() com ID:", usuario.id);

    this.consultaAPICadastroService.editarUsuario(usuario.id, usuario).subscribe({
      next: () => console.log("✅ Usuário editado com sucesso!"),
      error: (error) => console.error("❌ Erro ao editar usuário:", error)
    });
  }

}
