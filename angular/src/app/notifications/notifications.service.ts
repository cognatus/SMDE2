import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from '../_common/AuthHttp';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { API_URL } from '../app.constants';
import { Notification } from '../_models/notification';

@Injectable()
export class NotificationsService {
	url = API_URL + 'notif';
	constructor(private authHttp: AuthHttp) {}

	getNotifications(offset?: number): Observable<Notification[]> {
		return this.authHttp.get(this.url + '?offset=' + offset)
			.map(this.extractData)
			.catch(this.handleError);
	}

	setRead(id: string, userId: string, status: boolean): Observable<Notification> {
        let data = {
        	user: userId,
        	notif: id,
        	status: status
        }

        return this.authHttp.put(this.url + '/' + id, data)
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