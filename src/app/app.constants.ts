export const ApiUrl = 'http://localhost:3000/api/';

export const userTypes = ['Administrador', 'Estudiante', 'Profesor'];

export const notificationTexts = [
	{ string: [ // Usuarios
		{ text: 'se ha registrado.' },
		{ text: 'ha modificado su cuenta.' },
		{ text: 'ha modificado su foto de perfil.' }
	]},
	{ string: [ // Cursos
		{ text: 'ha creado el curso %e' },
		{ text: 'ha modificado el curso %e' },
		{ text: 'se ha suscrito al curso %e', textPlural: 'se han suscrito al curso %e' }
	]},
	{ string: [  // Grupos en cursos 
		{ text: 'ha creado el grupo %e en %e' },
		{ text: 'te ha movido al nuevo grupo %e en %e' },
		{ text: 'ha modificado el grupo %e en %e' },
		{ text: 'te ha movido al grupo %e en %e' },
		{ text: 'ha cambiado el nombre del grupo %e a %e en %e' },
		{ text: 'ha eliminado el grupo %e en %e' }
	]},
];

export function replaceCharacters(text: string): string {
	let charsForReplace = ['á','é','í','ó','ú'];
	let charsToReplace = ['a','e','i','o','u'];

	let newText = '';
	for ( let i = 0 ; i < text.length ; i++ ) {
		if ( charsForReplace.indexOf( text[i] ) > -1 ) {
			newText += charsToReplace[ charsForReplace.indexOf( text[i] ) ];
		} else {
			newText += text[i];
		}
	}
	return newText;
}

export class Colors {
	getColors(): string[] {
		return ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
					'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
					'#8BC34A', '#CDDC39', '#FFC107', '#FF9800',
					'#FF5722', '#795548', '#607D8B'];
	}

	getColor(character: string): string {
		let colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
					'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
					'#8BC34A', '#CDDC39', '#FFC107', '#FF9800',
					'#FF5722', '#795548', '#607D8B'];

		let char = character.toUpperCase().charCodeAt(0);
		let result = 0;
		let color = '#424242';

		if ( ( char > 47 && char < 58 ) || ( char > 64 && char < 91 ) ) {
			color = colors[char % colors.length];
		}

		return color;
	}
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
