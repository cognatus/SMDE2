import { Injectable } from '@angular/core';
import { FilterPipe } from '../_pipes/filter.pipe';

import * as _ from 'lodash';

declare let $: any;
@Injectable()
export class Util {
	public uploadImg(selectorID: string): void {
		$(`#${selectorID}`).trigger('click');
	}

	public displayImage(event: any): Promise<string[]> {
		return new Promise( (resolve, reject) => {
			if ( event.target.files && event.target.files[0] ) {
				var reader = new FileReader();
				let name = event.target.files[0].name;
				
				reader.onload = (loadEvent: any) => {
					resolve([loadEvent.target.result, name]);
				}
				reader.onerror = (error) => {
					console.log(error);
					reject('Error');
				};
				reader.readAsDataURL(event.target.files[0]);
			} else {
				reject('No se subio ninguna imagen');
			}
		});
		
	}

	public selectAll(status: boolean, list: any[]): void {
		if (!list) return;
		list.forEach( (item) => {
			item.selected = status;
		});
	}

	public getSelectedElements(list: any[]): any[] {
		let arr = [];
		if ( !list ) return [];
		list.forEach( (item) => {
			if ( item.selected ) {
				arr.push(item);
			}
		});
		return arr;
	}

	public getSelectedLength(list: any[]): number {
		let count = 0;
		if ( !list ) return 0;
		list.forEach( (item) => {
			if ( item.selected ) count++;
		});
		return count;
	}

	public getFiltered(items: any, filterArgs: any): any[] {
		let filter = new FilterPipe();

		return filter.transform(items, filterArgs, false)
	}

}

