import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const slide = 
	trigger('slide', [
		transition('void => normal', [
			style({ 
				transform: 'translateX(-100%)', 
				opacity: 0 
			}),
			animate('0.4s ease-in')
		]),
		transition('void => timed', [
			style({ 
				transform: 'translateX(-100%)', 
				opacity: 0 
			}),
			animate('0.4s ease-in')
		]),
		transition('normal => void', [
			animate('0.4s 100ms ease-out', style({ 
				transform: 'translateX(100%)', opacity: 0 
			}))
		]),
		transition('timed => void', [
			animate(0, style({ 
				transform: 'translateX(100%)', opacity: 0 
			}))
		])
	]);

export const slideReverse = 
	trigger('slideReverse', [
		transition('void => normal', [
			style({ transform: 'translateX(100%)' }),
			animate(400)
		]),
		transition('void => normal', [
			animate(400, style({ transform: 'translateX(-100%)' }))
		]),
		transition('void => timed', [
			style({ transform: 'translateX(100%)', opacity: 0 }),
			animate(400)
		]),
		transition('timed => void', [
			animate(0, style({ opacity: 0 }))
		])
	]);