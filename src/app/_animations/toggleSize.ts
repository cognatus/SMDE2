import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const toggleSize = 
	trigger('toggleSize', [
		transition(':enter', [
			style({ transform: 'scale(0)' }),
			animate(200)
		]),
		transition(':leave', [
			animate('200ms', style({ transform: 'scale(0)' }))
		])
	]);