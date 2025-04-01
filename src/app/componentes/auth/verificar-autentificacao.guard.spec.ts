import { TestBed } from '@angular/core/testing';

import { VerificarAutentificacaoGuard } from './verificar-autentificacao.guard';

describe('VerificarAutentificacaoGuard', () => {
  let guard: VerificarAutentificacaoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerificarAutentificacaoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
