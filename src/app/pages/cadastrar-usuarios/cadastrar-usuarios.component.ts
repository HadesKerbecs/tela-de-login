import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { disappearStateTrigger, shownStateTrigger } from 'src/app/animations';
import { ValidacaoService } from '../validacao.service';
import { CadastroRequest } from 'src/app/hooks/dados';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cadastrar-usuarios',
  templateUrl: './cadastrar-usuarios.component.html',
  styleUrls: ['./cadastrar-usuarios.component.scss'],
  animations: [shownStateTrigger, disappearStateTrigger],
})
export class CadastrarUsuariosComponent implements OnInit {
  @Output() usuarioCadastrado = new EventEmitter<CadastroRequest>();
  @Output() modalAberto = new EventEmitter<void>();
  @Input() modoEdicao: boolean = false;
  validado: boolean = false;
  etapaAtual: number = 1;
  formAberto: boolean = true;
  editando: boolean = false;

  usuarioForm: FormGroup = this.fb.group({
    id: [null],
    nome: ['', Validators.required],
    fantasia: ['', Validators.required],
    tipo_pessoa: ['', Validators.required],
    tipo_cadastro: [2, Validators.required],
    cadastro_tipo_id: [null, Validators.required],
    cpf_cnpj: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{14}$/)]],
    rg_ie: ['', Validators.required],
    tipo_regime_apuracao: ['', Validators.required],
    tipo_preco_venda: ['', Validators.required],
    ativo: [true, Validators.required],

    cadastro_endereco_padrao: this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      endereco: ['', Validators.required],
      endereco_numero: ['', Validators.required],
      endereco_bairro: ['', Validators.required],
      endereco_cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      endereco_municipio_codigo_ibge: [null],
      principal: [null, Validators.required],
      cobranca: [null, Validators.required],
      ie_produtor_rural: ['', [Validators.pattern(/^\d+$/)]],
    }),

    cadastro_contato_padrao: this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      fone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      enviar_orcamento: [null, Validators.required],
      enviar_nf: [null, Validators.required],
      enviar_boleto: [null, Validators.required],
    }),
  });

  constructor(private fb: FormBuilder, private service: ValidacaoService) {}

  ngOnInit(): void {
    this.gerarNovoId();
  }
  async gerarNovoId(): Promise<void> {
    try {
      const usuariosAtuais = await firstValueFrom(this.service.usuarios$);

      const novoId = usuariosAtuais?.length
        ? Math.max(...usuariosAtuais.map(u => u.id ?? 0)) + 1
        : 1;

      this.usuarioForm.patchValue({ id: novoId });
    } catch (error) {
      console.error('Erro ao gerar ID:', error);
    }
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
      const campos = ['nome', 'fantasia', 'tipo_pessoa', 'tipo_cadastro',
                    'cpf_cnpj', 'rg_ie', 'tipo_regime_apuracao', 'tipo_preco_venda'];
      return campos.every(campo => this.usuarioForm.get(campo)?.valid);
    }
    else if (this.etapaAtual === 2) {
      const enderecoGroup = this.usuarioForm.get('cadastro_endereco_padrao') as FormGroup;
      const campos = ['descricao', 'endereco', 'endereco_numero',
                     'endereco_bairro', 'endereco_cep', 'principal', 'cobranca'];
      return campos.every(campo => enderecoGroup.get(campo)?.valid);
    }
    else if (this.etapaAtual === 3) {
      const contatoGroup = this.usuarioForm.get('cadastro_contato_padrao') as FormGroup;
      const campos = ['descricao', 'fone', 'email',
                     'enviar_orcamento', 'enviar_nf', 'enviar_boleto'];
      return campos.every(campo => contatoGroup.get(campo)?.valid);
    }
    return false;
  }

  habilitarSalvamento(): string {
    if (this.usuarioForm.valid) {
      return 'botao-salvar';
    } else {
      return 'botao-desabilitado';
    }
  }

  habilitarAvanco(): string {
    return this.etapaValida() ? 'botao-salvar' : 'botao-desabilitado';
  }

  cancelarCadastro() {
    this.formAberto = !this.formAberto;
    this.usuarioForm.reset();
  }

  salvarCadastro() {
    if (this.editando) {
        this.editarUsuario();
    } else {
        this.criarUsuario();
    }
}

  criarUsuario(): void {
    const novoUsuario: CadastroRequest = this.usuarioForm.value;
    console.log("Dados do usuário:", novoUsuario);
    this.service.cadastrar(novoUsuario);
    this.usuarioCadastrado.emit(novoUsuario);
    this.usuarioForm.reset();
    this.formAberto = false;
    alert('Usuário cadastrado!');
  }

  editarUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioEditado: CadastroRequest = this.usuarioForm.value;

      console.log("🛠️ Dados do usuário antes do envio:", usuarioEditado);

      this.service.editar(usuarioEditado);

      this.usuarioForm.reset();
      this.editando = false;
      this.formAberto = false;

      console.log("🔄 Formulário resetado e modal fechado.");
    } else {
      console.warn("⚠️ Formulário inválido, verifique os campos!");
    }
  }

  abrirModalParaEdicao(usuario: CadastroRequest) {
    this.usuarioForm.patchValue(usuario);
    this.formAberto = true;
    this.editando = true;
    this.modalAberto.emit();
  }

  proximaEtapa() {
    if (this.etapaAtual < 3 && this.etapaValida()) {
      this.etapaAtual++;
    }
  }

  etapaAnterior() {
    if (this.etapaAtual > 1) {
      this.etapaAtual--;
    }
  }
}
