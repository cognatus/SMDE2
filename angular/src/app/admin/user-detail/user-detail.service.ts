import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../../_common/headers';
import { AuthHttp } from '../../_common/AuthHttp';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { API_URL } from '../../app.constants';
import { User } from '../../_models/user';

@Injectable()
export class UserDetailService {
	url = API_URL + 'users/';
	constructor(private http: Http, private authHttp: AuthHttp) {}

	getUser(id): Observable<User> {
		return this.authHttp.get(this.url + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	updateUser(user: User): Observable<User> {
        return this.authHttp.put(this.url + user._id, user)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteUser(id): Observable<User> {
        return this.authHttp.delete(this.url + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

	private extractData(res: Response) {
		let body = res.json().result;
		return body || {};
	}

	private handleError (error: Response | any) {
		console.error(error.message || error);
		return Observable.throw(error.message || error);
	}
}