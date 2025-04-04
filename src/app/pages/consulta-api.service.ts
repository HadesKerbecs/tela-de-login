import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroRequest, LoginRequest, LoginResponse } from '../hooks/dados';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaApiAuthService {
  apiUrl  = "https://desenvolvimento.maxdata.com.br/api/v1/Auth";
  constructor(private http: HttpClient) { }

  conectarUsuario(credenciais: LoginRequest): Observable<LoginResponse>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciais, { headers }).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token)
        }
      }),
      catchError(error => {
        console.error('❌ Erro na autenticação:', error);
        return throwError(() => error);
      })
    )
  };
}

@Injectable({ providedIn: 'root' })
export class ConsultaAPICadastroService {
    apiUrl = 'https://desenvolvimento.maxdata.com.br/api/v1/Cadastro';

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('Token de autenticação não encontrado.');
        }

        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    cadastrarUsuario(usuario: CadastroRequest): Observable<CadastroRequest> {
        console.log('📤 Enviando cadastro:', JSON.stringify(usuario));

        return this.http.post<CadastroRequest>(this.apiUrl, usuario, { headers: this.getHeaders() }).pipe(
            tap(response => console.log('✅ Resposta da API:', response)),
            catchError(error => {
                console.error('❌ Erro no cadastro:', error);
                return throwError(() => error);
            })
        );
    }

    editarUsuario(id: number, usuario: CadastroRequest): Observable<CadastroRequest> {
      console.log('📤 Enviando edição do usuário:', JSON.stringify(usuario));
      const headers = this.getHeaders();
      if (!headers) return throwError(() => new Error('Token não encontrado.'));

      return this.http.put<CadastroRequest>(`${this.apiUrl}/${id}`, usuario, { headers }).pipe(
          tap(response => console.log('✅ Resposta da API (Edição):', response)),
          catchError(error => {
              console.error('❌ Erro ao editar usuário:', error);
              return throwError(() => error);
          })
      );
  }
}