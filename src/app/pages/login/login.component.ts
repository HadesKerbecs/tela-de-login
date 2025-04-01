import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { shakeTrigger } from 'src/app/animations';
import { Router } from '@angular/router';
import { ConsultaApiAuthService } from '../consulta-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    shakeTrigger
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {
  formulario!: FormGroup;
  @ViewChild('campoInserirUser') campoInserirUser!: ElementRef;
  erroMensagem: string | undefined;

  constructor(
    private authLogin: ConsultaApiAuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.campoInserirUser.nativeElement.focus();
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ])],
      senha:['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ])],
      empresa_id: [219, Validators.required],
      loja_id: [1, Validators.required]
    })
  }

  fazerLogin(): void {
    if (this.formulario.valid) {
      const credenciais = {
        email: this.formulario.value.email,
        senha: this.formulario.value.senha,
        empresa_id: 219,
        loja_id: 1
      };

      this.authLogin.conectarUsuario(credenciais).subscribe({
        next: (res) => {
          console.log('Login bem-sucedido!', res);
          localStorage.setItem('access_token', res.access_token);
          console.log(res.access_token)
          this.router.navigate(['/listar-usuarios']);
        },
        error: (err) => {
          console.log('Erro no login:', err);
          this.erroMensagem = 'Erro ao autenticar. Verifique suas credencias'
        }
      }
      )
    }
  }

  habilitarBotao():string {
    if(this.formulario.valid) {
      return 'button'
    } else {
      return 'button__desabilitado'
    }
  }
}
