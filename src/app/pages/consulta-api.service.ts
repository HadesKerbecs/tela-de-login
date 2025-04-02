import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroRequest, LoginRequest, LoginResponse } from '../hooks/dados';
import { Observable, tap, throwError } from 'rxjs';

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
      })
    )
  };

}

@Injectable({
  providedIn: 'root'
})
export class ConsultaAPICadastroService {
  // URL base para a API de Cadastro
  apiUrl = "https://desenvolvimento.maxdata.com.br/api/v1/Cadastro";

  constructor(private http: HttpClient) {}

  cadastrarUsuario(usuario: CadastroRequest): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("Erro: Token de autenticação não encontrado.");
      throw new Error("Token não encontrado.");
    }

    // Se o cadastro for novo, remova campos que não devem ser enviados (ex.: id)
    const { id, ...payload } = usuario;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log("Dados enviados para API:", JSON.stringify(payload));
    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
}