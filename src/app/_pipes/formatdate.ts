import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
 	transform(date: string, arg: string) {
 		let newDate = new Date(date);
		const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

		let day = newDate.getDate() + 1 < 10 ? '0' + newDate.getDate().toString() : newDate.getDate().toString();
		let month = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString();
		let year = newDate.getFullYear().toString();
		let hour = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
		let minutes = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
		let formatedDate = '';

		if ( arg == 'time' ) {
			formatedDate = day + ' ' + monthLabels[parseInt(month)-1] + ' ' + year + ' a las ' + hour + ':' + minutes;
		} else {
			formatedDate = day + ' ' + monthLabels[parseInt(month)-1] + ' ' + year;
		}

		return formatedDate;
	}
}