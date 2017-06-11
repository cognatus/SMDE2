import { Pipe, PipeTransform } from '@angular/core';

export const ApiUrl = 'http://localhost:3000/api/';

export const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
						'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
						'#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
						'#FF5722', '#795548', '#607D8B', '#424242'];

export const userTypes = ['Administrador', 'Estudiante', 'Profesor'];

export function replaceCharacters(text: string): string {
	let charsForReplace = ['á','é','í','ó','ú'];
	let charsToReplace = ['a','e','i','o','u'];

	let newText = '';
	for ( let i = 0 ; i < text.length ; i++ ) {
		if ( charsForReplace.indexOf(text[i]) > -1 ) {
			newText += charsToReplace[charsForReplace.indexOf(text[i])];
		} else {
			newText += text[i];
		}
	}
	return newText;
}

export function getRandomColor(): string {
	const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
					'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
					'#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
					'#FF5722', '#795548', '#607D8B', '#424242'];
	return colors[Math.floor(Math.random()*colors.length)];
}

export function formatedDate(date: Date): string {
	const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

	let day = (date.getDate() + 1 < 10) ? '0' + (date.getDate() + 1).toString() : (date.getDate() + 1).toString();
	let month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
	let year = date.getFullYear().toString();
	let formatedDate = '';

	formatedDate = day + '/' + month + '/' + year;

	return formatedDate;
}

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
 	transform(date: string): string {
 		let newDate = new Date(date)
		const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

		let day = newDate.getDate() + 1 < 10 ? '0' + (newDate.getDate() + 1).toString() : (newDate.getDate() + 1).toString();
		let month = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString();
		let year = newDate.getFullYear().toString();
		let formatedDate = '';

		formatedDate = day + ' ' + monthLabels[parseInt(month)] + ' ' + year;

		return formatedDate;
	}
}
