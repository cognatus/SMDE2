import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiUrl } from '../app.constants';
import { Notification } from '../models/notification';

@Injectable()
export class NotificationsService {
	url = ApiUrl + 'notif';
	constructor(private http: Http ) {}

	getNotifications(): Observable<Notification[]> {
		return this.http.get(this.url)
			.map(this.extractData)
			.catch(this.handleError);
	}

	setRead(id: string, userId: string, status: boolean): Observable<Notification> {
        let options = new RequestOptions({ headers: ContentHeaders });
        let data = {
        	user: userId,
        	notif: id,
        	status: status
        }

        return this.http.put(this.url + '/' + id, data, options)
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