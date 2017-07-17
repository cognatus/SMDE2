import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const slice = 
	trigger('slice', [
		transition(':enter', [
			style({ transform: 'translateX(-100%)' }),
			animate(200)
		]),
		transition(':leave', [
			animate('300ms', style({ transform: 'translateX(-100%)' }))
		])
	]);

export const sliceReverse = 
	trigger('sliceReverse', [
		transition(':enter', [
			style({ transform: 'translateX(100%)' }),
			animate(200)
		]),
		transition(':leave', [
			animate('300ms', style({ transform: 'translateX(100%)' }))
		])
	]);