import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { CadastroRequest, CadastroResponse } from '../hooks/dados';
import { ConsultaAPICadastroService } from './consulta-api.service';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoService implements OnInit {
  private usuariosCadastrados = new BehaviorSubject<CadastroRequest[]>([]);
  usuarios$ = this.usuariosCadastrados.asObservable();

  constructor(private http: HttpClient, private consultaAPICadastroService: ConsultaAPICadastroService) {}

  listar(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ Erro: Token não encontrado.');
      return;
    }

    const params = new HttpParams().appendAll({ _sort: 'id', _order: 'asc' });
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http.get<CadastroResponse>(this.consultaAPICadastroService.apiUrl, { headers, params }).subscribe({
      next: (response) => {
        console.log('📌 Usuários obtidos:', response);
        this.usuariosCadastrados.next(response.itens || []);
      },
      error: (err) => console.error('❌ Erro ao listar usuários:', err),
    });
  }

  ngOnInit(): void {
    this.listar();
  }

  cadastrar(usuario: CadastroRequest): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('❌ Erro: Token não encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    console.log('📤 Enviando dados:', JSON.stringify(usuario, null, 2));

    this.http
      .post<CadastroRequest>(this.consultaAPICadastroService.apiUrl, usuario, { headers })
      .subscribe({
        next: (novoUsuario) => {
          console.log('✅ Cadastro realizado:', novoUsuario);
          const usuariosAtuais = this.usuariosCadastrados.getValue();
          this.usuariosCadastrados.next([...usuariosAtuais, novoUsuario]);
          this.listar();
        },
        error: (error) => {
          console.error('❌ Erro ao cadastrar usuário:', error);
          console.error('🔴 Status HTTP:', error.status);
          console.error('🔴 Corpo da resposta:', error.error);
        },
      });
  }

  buscarPorId(id: number): Observable<CadastroRequest> {
    const url = `${this.consultaAPICadastroService.apiUrl}/${id}`;
    return this.http.get<CadastroRequest>(url);
  }

  editar(usuario: CadastroRequest, atualizarSubject: boolean): void {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    console.log("Tentando editar usuário:", usuario);
    console.log("URL da API:", `${this.consultaAPICadastroService.apiUrl}/${usuario.id}`);
    console.log("Dados que estão sendo enviados:", JSON.stringify(usuario, null, 2));
    const body = JSON.stringify(usuario);

    this.http.put<CadastroRequest>(`${this.consultaAPICadastroService.apiUrl}/${usuario.id}`, body, { headers })
      .subscribe({
        next: (usuarioEditado) => {
          console.log("Usuário editado com sucesso:", usuarioEditado);
          if (atualizarSubject) {
            const tarefas = this.usuariosCadastrados.getValue();
            const index = tarefas.findIndex(user => user.id === usuarioEditado.id);
            if (index !== -1) {
              tarefas[index] = usuarioEditado;
              this.usuariosCadastrados.next(tarefas);
            }
          }
        },
        error: (erro) => {
          console.error("Erro ao editar usuário:", erro);
        }
      });
}


}
