import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const slide = 
	trigger('slide', [
		transition(':enter', [
			style({ transform: 'translateX(-100%)', opacity: 0 }),
			animate(300)
		]),
		transition(':leave', [
			animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 }))
		])
	]);

export const slideReverse = 
	trigger('slideReverse', [
		transition(':enter', [
			style({ transform: 'translateX(100%)' }),
			animate(500)
		]),
		transition(':leave', [
			animate(500, style({ transform: 'translateX(-100%)' }))
		]),
	]);