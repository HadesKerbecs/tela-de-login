import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CadastroRequest } from '../hooks/dados';
import { ConsultaAPICadastroService } from './consulta-api.service';

@Injectable({
  providedIn: 'root'
})
export class ValidacaoService {
  private usuariosCadastrados = new BehaviorSubject<CadastroRequest[]>([]);
  usuarios$ = this.usuariosCadastrados.asObservable();

  constructor(
    private http: HttpClient,
    private consultaAPICadastroService: ConsultaAPICadastroService
  ) {}

  // Método para buscar a lista de usuários via GET
  listar(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("Erro: Token não encontrado. Usuário não está autenticado.");
      return;
    }

    const params = new HttpParams().appendAll({
      _sort: 'cadastro_tipo_id',
      _order: 'asc'
    });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Supondo que a resposta da API seja do tipo: { success: true, itens: [...], paginacao: {...}, total: ... }
    this.http.get<any>(this.consultaAPICadastroService.apiUrl, { headers, params })
      .subscribe({
        next: (response) => {
          console.log("Resposta da API:", response);
          // Extrai o array de usuários a partir da propriedade "itens"
          const usuarios: CadastroRequest[] = response.itens || [];
          this.usuariosCadastrados.next(usuarios);
        },
        error: (err) => {
          console.error("Erro ao listar usuários:", err);
        }
      });
  }

  // Método para cadastrar um usuário via POST
  cadastrar(usuario: CadastroRequest): void {
    console.log("Iniciando cadastro do usuário:", usuario);

    this.consultaAPICadastroService.cadastrarUsuario(usuario)
      .subscribe({
        next: (novoUsuario) => {
          console.log("Usuário cadastrado com sucesso:", novoUsuario);
          // Após cadastrar, atualiza a lista de usuários
          this.listar();
        },
        error: (err) => {
          console.error("Erro ao cadastrar usuário:", err);
          if (err.error) {
            console.error("Detalhes do erro:", err.error);
            if (err.error.errors) {
              console.error("Erros específicos:", err.error.errors);
            }
          }
        }
      });
  }

  buscarPorId(cadastro_tipo_id: number): Observable<CadastroRequest> {
    const url = `${this.consultaAPICadastroService.apiUrl}/${cadastro_tipo_id}`;
    return this.http.get<CadastroRequest>(url);
  }

  // Método para editar um usuário via PUT
  editar(usuario: CadastroRequest): void {
    const token = localStorage.getItem('access_token');
    console.log("Token utilizado:", token);
    if (!token) {
      console.error("Erro: Token não encontrado.");
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.put<CadastroRequest>(
      `${this.consultaAPICadastroService.apiUrl}/${usuario.cadastro_tipo_id}`, 
      usuario, 
      { headers }
    ).subscribe({
      next: (usuarioEditado) => {
        console.log("Usuário editado com sucesso:", usuarioEditado);
        this.listar();
      },
      error: (err) => {
        console.error("Erro ao editar usuário:", err);
      }
    });
    console.log("ID do usuário para edição:", usuario.cadastro_tipo_id);
  }
}
