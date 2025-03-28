import { animate, keyframes, style, transition, trigger, state, query } from "@angular/animations";

// export const shakeTrigger = trigger('shakeAnimation', [
//   state('valid', style({})), // Estado válido sem alteração
//   state('invalid', style({})), // Estado inválido sem alteração
//   transition('* => invalid', [
//     animate('0.5s', keyframes([
//       style({ border: '1px solid red', offset: 0 }),
//       style({ transform: 'translateX(-10px)', offset: 0.1 }),
//       style({ transform: 'translateX(10px)', offset: 0.2 }),
//       style({ transform: 'translateX(-10px)', offset: 0.3 }),
//       style({ transform: 'translateX(10px)', offset: 0.4 }),
//       style({ transform: 'translateX(-10px)', offset: 0.5 }),
//       style({ transform: 'translateX(0)', offset: 0.6 }),
//     ]))
//   ])
// ]);

export const shakeTrigger = trigger('shakeAnimation', [
  transition('* => *', [
    query('input.ng-invalid:focus, select.ng-invalid:focus', [
      animate('0.5s', keyframes([
        style({ border: '2px solid red '}),
        style({ transform: 'translateX(-10px)'}),
        style({ transform: 'translateX(10px)'}),
        style({ transform: 'translateX(-10px)'}),
        style({ transform: 'translateX(10px)'}),
        style({ transform: 'translateX(-10px)'}),
        style({ transform: 'translateX(10px)'}),
        style({ transform: 'translateX(-10px)'}),
        style({ transform: 'translateX(0)'}),
      ]))
    ], {optional: true})
  ])
])

export const shownStateTrigger = trigger('shownState', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(300, style({
      opacity: 1
    }))
  ]),
  transition(':leave', [
    animate(300, style({
      opacity: 0
    }))
  ])
])