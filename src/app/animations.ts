import { animate, keyframes, style, transition, trigger, state, query } from "@angular/animations";

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

export const disappearStateTrigger = trigger('disappearState', [
  transition(':leave', [
    style({
      opacity: 0
    }),
    animate(300, style({
      opacity: 1
    }))
  ]),
  transition(':enter', [
    animate(300, style({
      opacity: 0
    }))
  ])
])