import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { disappearStateTrigger, shownStateTrigger } from 'src/app/animations';
import { ValidacaoService } from '../validacao.service';
import { CadastroRequest } from 'src/app/hooks/dados';
import { ConsultaCepService } from '../consulta-api.service';

@Component({
  selector: 'app-cadastrar-usuarios',
  templateUrl: './cadastrar-usuarios.component.html',
  styleUrls: ['./cadastrar-usuarios.component.scss'],
  animations: [shownStateTrigger, disappearStateTrigger],
})
export class CadastrarUsuariosComponent implements OnInit {
  // Emite o usuário cadastrado para o componente pai
  @Output() usuarioCadastrado = new EventEmitter<CadastroRequest>();
  @Output() modalAberto = new EventEmitter<void>();
  validado: boolean = false;
  etapaAtual: number = 1;
  formAberto: boolean = true;
  editando: boolean = false;

  usuarioForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    fantasia: ['', Validators.required],
    tipo_pessoa: ['', Validators.required],
    tipo_cadastro: ['', Validators.required],
    cadastro_tipo_id: [2, Validators.required],
    cpf_cnpj: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{14}$/)]],
    // (/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/)
    rg_ie: ['', Validators.required],
    tipo_regime_apuracao: ['', Validators.required],
    tipo_preco_venda: ['', Validators.required],

    cadastro_endereco_padrao: this.fb.group({
      descricao: ['', Validators.required],
      endereco: ['', Validators.required],
      endereco_numero: ['', Validators.required],
      endereco_bairro: ['', Validators.required],
      endereco_cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      // (/^\d{5}-\d{3}$/)
      endereco_municipio_codigo_ibge: [null],
      principal: [null, Validators.required],
      cobranca: [null, Validators.required],
      ie_produtor_rural: ['', [Validators.pattern(/^\d+$/)]],
      // (/^[0-9]+$/)
    }),

    cadastro_contato_padrao: this.fb.group({
      descricao: ['', Validators.required],
      fone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      // (/^\(\d{2}\) \d{4,5}-\d{4}$/)
      email: ['', [Validators.required, Validators.email]],
      enviar_orcamento: [null, Validators.required],
      enviar_nf: [null, Validators.required],
      enviar_boleto: [null, Validators.required],
    }),
  });

  constructor(private fb: FormBuilder, private service: ValidacaoService, private consultaCepService: ConsultaCepService) {}

  ngOnInit(): void {
    // this.camposAutomaticos();
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
    if(this.usuarioForm.value.id) {
      this.editarUsuario();
    } else {
      this.criarUsuario();
    }
  }

  criarUsuario() {
    console.log("Tentando criar usuário...");
    this.editando = false;
    if (this.usuarioForm.valid) {
      const novoUsuario = this.usuarioForm.value;
      console.log("Dados do usuário:", novoUsuario);

      // this.usuarioCadastrado.emit(novoUsuario);
      this.service.cadastrar(novoUsuario);

      localStorage.setItem('usuario', JSON.stringify(novoUsuario));

      this.usuarioForm.reset();
      this.formAberto = !this.formAberto;
      alert('Usuário cadastrado!')
    } else {
      console.error("Formulário inválido!");
    }
  }

  editarUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioEditado: CadastroRequest = this.usuarioForm.value;
      console.log('Dados antes de editar:', usuarioEditado);
      this.service.editar(usuarioEditado, true);
      this.formAberto = false;
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

  consultaCEP(evento: any){
    const cep = evento.target.value.replace(/\D/g, '');

    if (cep.length === 8) {
    this.consultaCepService.getConsultaCep(cep).subscribe((resultado: any) => {
      if (!resultado.erro) {
        this.populandoEndereco(resultado);
      } else {
        alert('CEP não encontrado!');
      }
    });
  }
  }

  populandoEndereco(dados: any) {
    this.usuarioForm.patchValue({
      cadastro_endereco_padrao: {
        endereco: dados.logradouro || '',
        endereco_bairro: dados.bairro || '',
        endereco_cep: dados.cep || '',
        endereco_municipio_codigo_ibge: dados.ibge || '',
      }
    });
  }

  // private camposAutomaticos(): void {
  //   this.usuarioForm.get('cpf_cnpj')?.valueChanges.subscribe(value => {
  //     const organizar = value.replace(/\D/g, '');
  //     if(organizar.length <= 11) {
  //       this.usuarioForm.get('cpf_cnpj')?.setValue(
  //         organizar.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
  //         { emitEvent: false }
  //       );
  //     } else {
  //       this.usuarioForm.get('cpf_cnpj')?.setValue(
  //         organizar.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
  //         {emitEvent: false}
  //       );
  //     }
  //   });

  //   this.usuarioForm.get('rg_ie')?.valueChanges.subscribe(value => {
  //     const apenasNumeros = value.replace(/\D/g, '');
  //     if (value !== apenasNumeros) {
  //       this.usuarioForm.get('rg_ie')?.setValue(apenasNumeros, { emitEvent: false });
  //     }
  //   });

  //   this.usuarioForm.get('cadastro_contato_padrao.fone')?.valueChanges.subscribe(value => {
  //     const organizar = value.replace(/\D/g, '');
  //     if(organizar.length > 10) {
  //       this.usuarioForm.get('fone')?.setValue(
  //         organizar.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
  //         { emitEvent: false }
  //       );
  //     } else {
  //       this.usuarioForm.get('cadastro_contato_padrao.fone')?.setValue(
  //         organizar.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'),
  //         { emitEvent: false }
  //       );
  //     }
  //   });
  // }
}
