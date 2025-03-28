import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../hooks/dados';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaApiAuthService {
  apiUrl  = "https://desenvolvimento.maxdata.com.br/api/v1/auth";
  constructor(private http: HttpClient) { }

  conectarUsuario(credenciais: LoginRequest): Observable<LoginResponse>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciais, { headers })
  };

}
@Injectable({
  providedIn: 'root'
})
export class ConsultaAPICadastroService {
  apiUrl = "https://desenvolvimento.maxdata.com.br/api/v1/Cadastro"
  constructor(private http: HttpClient) { }

}
