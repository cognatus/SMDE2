import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 

import { ApiUrl } from '../app.constants';
import { User } from '../models/user';

@Injectable()
export class LoginService {
	url = ApiUrl + 'login';
	constructor(private http: Http) {}

	loginUser(user:User): Observable<User> {
		let options = new RequestOptions({ headers: ContentHeaders });

		return this.http.post(this.url, user, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		let body = res.json();
        return body[0] || {};
    }

    private handleError (error: Response | any) {
		console.error(error.message || error);
		return Observable.throw(error.message || error);
    }
}