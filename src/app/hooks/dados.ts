export interface LoginRequest {
  empresa_id: number;
  email: string;
  senha: string;
  loja_id: number;
}

export interface LoginResponse {
  access_token: string;
  usuario_id: number;
}

export interface CadastroRequest {
  nome: string;
  fantasia: string;
  tipo_pessoa: 'Fisica' | 'Juridica';
  tipo_cadastro: 'Cliente' | 'Fornecedor' | 'Outro';
  cadastro_tipo_id: number;
  cpf_cnpj: string;
  rg_ie: string;
  tipo_regime_apuracao: 'Simples' | 'Lucro Presumido' | 'Lucro Real';
  tipo_preco_venda: 'SomenteVenda' | 'Outro';
  cadastro_endereco_padrao: CadastroEndereco;
  cadastro_contato_padrao: CadastroContato;
}

export interface CadastroEndereco {
  descricao: string;
  endereco: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cep: string;
  endereco_municipio_codigo_ibge: number;
  principal: boolean;
  cobranca: boolean;
  ie_produtor_rural: string;
}

export interface CadastroContato {
  descricao: string;
  fone: string;
  email: string;
  enviar_orcamento: boolean;
  enviar_nf: boolean;
  enviar_boleto: boolean;
}
