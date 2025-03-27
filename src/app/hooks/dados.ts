export interface LoginRequest {
  empresa_id: number;
  email: string;
  senha: string;
  loja_id: number;
}

export interface LoginResponse {
  token: string;
  usuario_id: number;
}