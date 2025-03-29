import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { shownStateTrigger } from 'src/app/animations';
import { ValidacaoService } from '../validacao.service';
import { CadastroRequest } from 'src/app/hooks/dados';

@Component({
  selector: 'app-cadastrar-usuarios',
  templateUrl: './cadastrar-usuarios.component.html',
  styleUrls: ['./cadastrar-usuarios.component.scss'],
  animations: [
    shownStateTrigger
  ]
})
export class CadastrarUsuariosComponent implements OnInit {
  validado: boolean = false;
  listaUsuarios: CadastroRequest[] = []

  usuarioForm: FormGroup = this.fb.group({
      nome: ['', Validators.required],
      fantasia: ['', Validators.required],
      tipo_pessoa: ['', Validators.required],
      tipo_cadastro: ['', Validators.required],
      cpf_cnpj: ['', Validators.required],
      rg_ie: ['', Validators.required],
      tipo_regime_apuracao: ['', Validators.required],
      tipo_preco_venda: ['', Validators.required],

      cadastro_endereco_padrao: this.fb.group({
        descricao: ['', Validators.required],
        endereco: ['', Validators.required],
        endereco_numero: ['', Validators.required],
        endereco_bairro: ['', Validators.required],
        endereco_cep: ['', Validators.required],
        endereco_municipio_codigo_ibge: [0],
        principal: [null, Validators.required],
        cobranca: [false, Validators.required],
        ie_produtor_rural: ['']
      }),

      cadastro_contato_padrao: this.fb.group({
        descricao: ['', Validators.required],
        fone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        enviar_orcamento: [false, Validators.required],
        enviar_nf: [false, Validators.required],
        enviar_boleto: [false, Validators.required]
      })
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ValidacaoService
  ) { }

  ngOnInit(): void {
  }

  campoValidado(campoAtual: string): string {
    if (
      this.usuarioForm.get(campoAtual)?.errors &&
      this.usuarioForm.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-tarefa input-invalido';
    } else {
      this.validado = true;
      return 'form-tarefa';
    }
  }

  habilitarBotao(): string {
    if (this.usuarioForm.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  cancelarCadastro() {
    this.router.navigate(['/listar-usuarios'])
     alert("Pensamento Cancelado!")
   }

   salvarCadastro() {
    if (this.usuarioForm.value.id) {
      this.editarUsuario();
    } else {
      this.criarUsuario();
    }
  }

  criarUsuario() : void {
    if(this.usuarioForm.valid) {
      const novoUsuario: CadastroRequest = this.usuarioForm.value;
      this.service.cadastrar(novoUsuario)
    }
  }

  editarUsuario(): void {
    if(this.usuarioForm.valid) {
      const tarefaEditada: CadastroRequest = this.usuarioForm.value;
      this.service.editar(tarefaEditada, true)
    }
  }

}
