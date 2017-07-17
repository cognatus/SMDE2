import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const fade = 
	trigger('fade', [
		transition(':enter', [
			style({ opacity: 0 }),
			animate(500)
		]),
		transition(':leave', [
			animate(500, style({ opacity: 0 }))
		])
	]);