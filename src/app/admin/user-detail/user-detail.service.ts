import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiUrl } from '../../app.constants';
import { User } from '../../_models/user';

@Injectable()
export class UserDetailService {
	url = ApiUrl + 'users/';
	constructor(private http: Http) {}

	getUser(id): Observable<User> {
		return this.http.get(this.url + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	updateUser(user: User): Observable<User> {
        let options = new RequestOptions({ headers: ContentHeaders });

        return this.http.put(this.url + user._id, user, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteUser(id): Observable<User> {
    	let options = new RequestOptions({ headers: ContentHeaders });
        return this.http.delete(this.url + id, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

	private extractData(res: Response) {
		let body = res.json();
		return body || {};
	}

	private handleError (error: Response | any) {
		console.error(error.message || error);
		return Observable.throw(error.message || error);
	}
}