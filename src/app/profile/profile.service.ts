import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 

import { ApiUrl } from '../app.constants';
import { User } from '../_models/user';

@Injectable()
export class ProfileService {
	url = ApiUrl + 'profile';
	constructor(private http: Http) {}

	updatePhoto(album: string, name: string): Observable<any> {
		let options = new RequestOptions({ headers: ContentHeaders });
		let data = { album: album, name: name }

		return this.http.put(this.url, data, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	deletePhoto(album: string, name: string): Observable<any> {
		let options = new RequestOptions({ headers: ContentHeaders });
		let deleteUrl = this.url + '?album='+ album +'&name=' + name;

		return this.http.delete(deleteUrl, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		let body = res.json();
        return body.user || {};
    }

    private handleError (error: Response | any) {
		console.error(error.message || error);
		return Observable.throw(error.message || error);
    }
}