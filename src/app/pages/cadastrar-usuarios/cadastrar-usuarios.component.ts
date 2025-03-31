import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { disappearStateTrigger, shownStateTrigger } from 'src/app/animations';
import { ValidacaoService } from '../validacao.service';
import { CadastroRequest } from 'src/app/hooks/dados';

@Component({
  selector: 'app-cadastrar-usuarios',
  templateUrl: './cadastrar-usuarios.component.html',
  styleUrls: ['./cadastrar-usuarios.component.scss'],
  animations: [
    shownStateTrigger,
    disappearStateTrigger
  ]
})
export class CadastrarUsuariosComponent implements OnInit {
  @Output() usuarioCadastrado = new EventEmitter<CadastroRequest>();
  validado: boolean = false;
  etapaAtual: number = 1;
  formAberto: boolean = true;

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
      return 'form-usuario input-invalido';
    } else {
      this.validado = true;
      return 'form-usuario';
    }
  }

  etapaValida(): boolean {
    if (this.etapaAtual === 1) {
      return this.usuarioForm.valid; 
    } else if (this.etapaAtual === 2) {
      return this.usuarioForm.get('cadastro_endereco_padrao')?.valid || false;
    } else if (this.etapaAtual === 3) {
      return this.usuarioForm.get('cadastro_contato_padrao')?.valid || false;
    }
    return false;
  }  

  habilitarBotao(): string {
    if (this.usuarioForm.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  cancelarCadastro() {
    this.formAberto = !this.formAberto;
   }

  criarUsuario() {
    if(this.usuarioForm.valid) {
      const novoUsuario = this.usuarioForm.value;
      this.usuarioCadastrado.emit(novoUsuario);
      this.service.cadastrar(novoUsuario)
      this.usuarioForm.reset(); 
    }
  }

  proximaEtapa() {
    if(this.etapaAtual < 3) {
      this.etapaAtual++;
    }
  }

  etapaAnterior() {
    if(this.etapaAtual > 1) {
      this.etapaAtual--;
    }
  }
}
