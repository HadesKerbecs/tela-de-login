import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const verificarAutenticacaoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    const token = localStorage.getItem('token');

    // Verificação mais robusta
    if (token && typeof token === 'string' && token.length > 10) {
      return true;
    }

    // Redireciona para login mantendo a URL desejada como parâmetro
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error);
    router.navigate(['/login']);
    return false;
  }
};
