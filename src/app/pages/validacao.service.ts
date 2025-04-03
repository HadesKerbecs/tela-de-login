import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CadastroRequest } from '../hooks/dados';
import { ConsultaAPICadastroService } from './consulta-api.service';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoService {
  private usuariosCadastrados = new BehaviorSubject<CadastroRequest[]>([]);
  usuarios$ = this.usuariosCadastrados.asObservable();

  constructor(
    private http: HttpClient,
    private consultaAPICadastroService: ConsultaAPICadastroService
  ) {}

  // Método para buscar a lista de usuários via GET
  listar(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ Erro: Token não encontrado.');
      return;
    }

    const params = new HttpParams().appendAll({
      _sort: 'cadastro_tipo_id',
      _order: 'asc',
      _page: '1',
      _limit: '50'
    });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Supondo que a resposta da API seja do tipo: { success: true, itens: [...], paginacao: {...}, total: ... }
    this.http.get<any>(this.consultaAPICadastroService.apiUrl, { headers, params })
      .subscribe({
        next: (response) => {
          console.log("Resposta da API:", response);
          // Extrai o array de usuários a partir da propriedade "itens"
          const usuarios: CadastroRequest[] = response.itens || [];
          this.usuariosCadastrados.next(usuarios);
        },
        error: (err) => {
          console.error("Erro ao listar usuários:", err);
        }
      });
  }

  // Método para cadastrar um usuário via POST
  cadastrar(usuario: CadastroRequest): void {
    this.consultaAPICadastroService.cadastrarUsuario(usuario)
      .subscribe({
        next: (novoUsuario) => {
          console.log("✅ Resposta da API:", novoUsuario);
          if (novoUsuario && novoUsuario.id) {
            console.log("🎉 Usuário cadastrado com sucesso:", novoUsuario);
          } else {
            console.warn("⚠️ Usuário pode não ter sido cadastrado corretamente!", novoUsuario);
          }
          this.listar();
        },
        error: (err) => {
          console.error("❌ Erro ao cadastrar usuário:", err);
          if (err.error) {
            console.error("📌 Detalhes do erro:", err.error);
            if (err.error.errors) {
              console.error("🔍 Erros específicos:", err.error.errors);
            }
          }
        }
      });
  }
  
  

  buscarPorId(id: number): Observable<CadastroRequest> {
    const url = `${this.consultaAPICadastroService.apiUrl}/${id}`;
    return this.http.get<CadastroRequest>(url);
  }


  // Método para editar um usuário via PUT
  editar(usuario: CadastroRequest): void {
    const token = localStorage.getItem('access_token');
    console.log("🔑 Token utilizado:", token);

    if (!token) {
        console.error("❌ Erro: Token não encontrado.");
        return;
    }

    if (!usuario.id) {
        console.error("❌ Erro: ID do usuário não encontrado.");
        return;
    }

    // Criar um objeto com apenas os campos necessários
    const payload = {
        id: usuario.id,
        nome: usuario.nome,
        fantasia: usuario.fantasia,
        tipo_pessoa: usuario.tipo_pessoa,
        // ... inclua todos os outros campos necessários
        cadastro_endereco_padrao: usuario.cadastro_endereco_padrao,
        cadastro_contato_padrao: usuario.cadastro_contato_padrao
    };

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    console.log("✏ ID do usuário para edição:", usuario.id);
    console.log("📤 Dados enviados para API:", JSON.stringify(payload, null, 2)); // Formata bonito para leitura

    this.http.put<CadastroRequest>(
        `${this.consultaAPICadastroService.apiUrl}/${usuario.id}`, 
        payload,
        { headers }
    ).subscribe({
        next: (usuarioEditado) => {
            console.log("✅ Usuário editado com sucesso:", usuarioEditado);
            this.listar();
        },
        error: (err) => {
            console.error("❌ Erro ao editar usuário:", err);
            if (err.error) {
                console.error("📌 Detalhes do erro:", JSON.stringify(err.error, null, 2));
                if (err.error.errors) {
                    console.error("🔍 Erros específicos:", err.error.errors);
                }
            }
        }
    });
}
  
  
consultarUsuario(id: number): void {
  const token = localStorage.getItem('access_token');
  console.log("🔑 Token utilizado:", token);

  if (!token) {
    console.error("❌ Erro: Token não encontrado.");
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  this.http.get<any>(
    `${this.consultaAPICadastroService.apiUrl}/${id}`, 
    { headers }
  ).subscribe({
    next: (usuario) => {
      console.log("✅ Usuário encontrado:", usuario);
    },
    error: (err) => {
      console.error("❌ Erro ao consultar usuário:", err);
    }
  });
}


}
