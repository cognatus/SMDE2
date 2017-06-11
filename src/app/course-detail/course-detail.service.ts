import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiUrl } from '../app.constants';
import { User } from '../models/user';
import { Course } from '../models/course';

@Injectable()
export class CourseDetailService {
	url = ApiUrl + 'courses/';
	constructor(private http: Http) {}

	getCourse(id): Observable<Course> {
		return this.http.get(this.url + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	suscribeCourse(id: string, user: User): Observable<Course> {
        let options = new RequestOptions({ headers: ContentHeaders });

        return this.http.put(this.url + id + '/suscribe', user, options)
            .map(response => console.log(response))
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