import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../_common/headers';
import { AuthHttp } from '../_common/AuthHttp';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 

import { API_URL } from '../app.constants';
import { User } from '../_models/user';

@Injectable()
export class ProfileService {
	url = API_URL + 'profile';
	constructor(private http: Http, private authHttp: AuthHttp) {}

	updatePhoto(album: string, name: string): Observable<any> {
		let data = { album: album, name: name }

		return this.authHttp.put(this.url, data)
			.map(this.extractData)
			.catch(this.handleError);
	}

	deletePhoto(album: string, name: string): Observable<any> {
		let deleteUrl = this.url + '?album='+ album +'&name=' + name;

		return this.authHttp.delete(deleteUrl)
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		let body = res.json().result;
        return body.user || {};
    }

    private handleError (error: Response | any) {
		console.error(error.message || error);
		return Observable.throw(error.message || error);
    }
}