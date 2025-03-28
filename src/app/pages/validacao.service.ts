import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CadastroRequest, LoginRequest,  LoginResponse } from '../hooks/dados';
import { ConsultaApiAuthService, ConsultaAPICadastroService } from './consulta-api.service';

@Injectable({
  providedIn: 'root'
})
export class ValidacaoService {
  conectarUsuario(credenciais: { email: any; senha: any; empresa_id: number; loja_id: number; }) {
    throw new Error('Method not implemented.');
  }
  private usuariosCadastrados = new BehaviorSubject<CadastroRequest[]>([])
  usuarios$ = this.usuariosCadastrados.asObservable();

  constructor(
    private http: HttpClient,
    private cadastrarUsuario: ConsultaAPICadastroService
  ) { }

  listar(): void {
    let params = new HttpParams().appendAll({
      _sort: 'cadastro_tipo_id',
      _order: 'asc',
    });
    this.http.get<CadastroRequest[]>(this.cadastrarUsuario.apiUrl, { params }).subscribe((usuarios) =>{
      let listaDeUsuarios = this.usuariosCadastrados.getValue();
      listaDeUsuarios = listaDeUsuarios.concat(usuarios)
      this.usuariosCadastrados.next(listaDeUsuarios);
    })
  }

  cadastrar(usuario: CadastroRequest): void {
    this.http.post<CadastroRequest>(this.cadastrarUsuario.apiUrl, usuario).subscribe(novoUsuario => {
      const usuarios = this.usuariosCadastrados.getValue();
      usuarios.unshift(novoUsuario)
      this.usuariosCadastrados.next(usuarios);
    });
  }

  buscarPorId(cadastro_tipo_id: number): Observable<CadastroRequest> {
    const url = `${this.cadastrarUsuario.apiUrl}/${cadastro_tipo_id}`;
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
