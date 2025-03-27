import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest,  LoginResponse } from '../hooks/dados';

@Injectable({
  providedIn: 'root'
})
export class ValidacaoService {

  private readonly apiUrl  = "https://desenvolvimento.maxdata.com.br/api/v1/auth";

  constructor(private http: HttpClient) { }

  conectarUsuario(credenciais: LoginRequest): Observable<LoginResponse>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciais, { headers })
  };
}
