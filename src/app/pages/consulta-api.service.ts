import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../hooks/dados';
import { Observable, throwError } from 'rxjs';

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