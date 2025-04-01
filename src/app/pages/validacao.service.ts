import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CadastroRequest, LoginRequest, LoginResponse } from '../hooks/dados';
import { ConsultaAPICadastroService } from './consulta-api.service';

@Injectable({
  providedIn: 'root'
})
export class ValidacaoService {
  private usuariosCadastrados = new BehaviorSubject<CadastroRequest[]>([]);
  usuarios$ = this.usuariosCadastrados.asObservable();

  constructor(
    private http: HttpClient,
    private consultaAPICadastroService: ConsultaAPICadastroService,
    private cadastrarUsuario: ConsultaAPICadastroService
  ) {}

  listar(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error("Erro: Token não encontrado. Usuário não está autenticado.");
      return;
    }

    let params = new HttpParams().appendAll({
      _sort: 'cadastro_tipo_id',
      _order: 'asc',
    });

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<CadastroRequest[]>(this.cadastrarUsuario.apiUrl, { headers, params }).subscribe({
      next: (usuarios) => {
        let listaDeUsuarios = this.usuariosCadastrados.getValue();
        listaDeUsuarios = listaDeUsuarios.concat(usuarios);
        this.usuariosCadastrados.next(listaDeUsuarios);
      },
      error: (err) => {
        console.error("Erro ao buscar usuários:", err);
      }
    });
  }

  cadastrar(usuario: CadastroRequest): void {
    console.log("Iniciando cadastro do usuário:", usuario);

    this.consultaAPICadastroService.cadastrarUsuario(usuario).subscribe({
      next: (novoUsuario) => {
        console.log("Usuário cadastrado com sucesso:", novoUsuario);
        this.usuariosCadastrados.next([...this.usuariosCadastrados.getValue(), novoUsuario]);
      },
      error: (err) => {
        console.error("Erro ao cadastrar usuário:", err);
      }
    });
  }

  buscarPorId(cadastro_tipo_id: number): Observable<CadastroRequest> {
    const url = `${this.consultaAPICadastroService.apiUrl}/${cadastro_tipo_id}`;
    return this.http.get<CadastroRequest>(url);
  }

  editar(usuario: CadastroRequest, atualizarSubject: boolean): void {
    this.http.put<CadastroRequest>(`${this.cadastrarUsuario.apiUrl}/${usuario.cadastro_tipo_id}`, usuario).subscribe(usuarioEditado => {
      if(atualizarSubject){
        const usuarios = this.usuariosCadastrados.getValue();
        const index = usuarios.findIndex(t => t.cadastro_tipo_id === usuarioEditado.cadastro_tipo_id);
        if (index !== -1) {
          usuarios[index] = usuarioEditado;
          this.usuariosCadastrados.next(usuarios);
        }
      }
    });
  }
}
