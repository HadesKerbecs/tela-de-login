import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroRequest, LoginRequest, LoginResponse } from '../hooks/dados';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaApiAuthService {
  apiUrl  = "https://desenvolvimento.maxdata.com.br/api/v1/Auth";
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
   apiUrl = "https://desenvolvimento.maxdata.com.br/api/v1/Cadastro";

  constructor(private http: HttpClient) {}

  cadastrarUsuario(usuario: CadastroRequest): Observable<CadastroRequest> {
    const token = localStorage.getItem('access_token');

    console.log("Token recuperado:", token);
    if (!token) {
      console.error("Erro: Token de autenticação não encontrado.");
      throw new Error("Token não encontrado.");
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CadastroRequest>(this.apiUrl, usuario, { headers });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {
 apiURL = 'https://viacep.com.br/ws/'
 constructor(private http: HttpClient) { }

 getConsultaCep(cep: string){
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8 ? this.http.get(`${this.apiURL}${cep}/json`) : new Observable();
 }
}