import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { shownStateTrigger } from 'src/app/animations';

@Component({
  selector: 'app-cadastrar-usuarios',
  templateUrl: './cadastrar-usuarios.component.html',
  styleUrls: ['./cadastrar-usuarios.component.scss'],
  animations: [
    shownStateTrigger
  ]
})
export class CadastrarUsuariosComponent implements OnInit {
  usuarioForm: FormGroup = this.fb.group({
      nome: ['', Validators.required],
      fantasia: ['', Validators.required],
      tipo_pessoa: ['Fisica', Validators.required],
      tipo_cadastro: ['Cliente', Validators.required],
      cpf_cnpj: ['', Validators.required],
      rg_ie: ['', Validators.required],
      tipo_regime_apuracao: ['Simples', Validators.required],
      tipo_preco_venda: ['SomenteVenda', Validators.required],
      cadastro_endereco_padrao: this.fb.group({
        descricao: ['', Validators.required],
        endereco: ['', Validators.required],
        endereco_numero: ['', Validators.required],
        endereco_bairro: ['', Validators.required],
        endereco_cep: ['', Validators.required],
        endereco_municipio_codigo_ibge: [0, Validators.required],
        principal: [false, Validators.required],
        cobranca: [false, Validators.required],
        ie_produtor_rural: ['', Validators.required]
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
  }
  campoValidado(campoAtual: string): string {
    if (
      this.formulario.get(campoAtual)?.errors &&
      this.formulario.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-tarefa input-invalido';
    } else {
      this.validado = true;
      return 'form-tarefa';
    }
  }
}
