import { animate, keyframes, style, transition, trigger } from "@angular/animations";

export const shakeTrigger = trigger('shakeAnimation', [
  transition('invalid => invalid', [
    animate('0.5s', keyframes([
      style({ border: '1px solid red' }),
      style({ transform: 'translateX(-10px)' }),
      style({ transform: 'translateX(10px)' }),
      style({ transform: 'translateX(-10px)' }),
      style({ transform: 'translateX(10px)' }),
      style({ transform: 'translateX(-10px)' }),
      style({ transform: 'translateX(0)' }),
    ]))
  ])
]);
