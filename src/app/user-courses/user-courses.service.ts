import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiUrl } from '../app.constants';
import { Course } from '../models/course';

@Injectable()
export class UserCoursesService {
	url = ApiUrl + 'user/courses';
	constructor(private http: Http ) {}

	getCourses(userId): Observable<Course[]> {
		return this.http.get(this.url + '/' + userId + '/subjects')
			.map(this.extractData)
			.catch(this.handleError);
	}

	addCourses(userId, courses: Course[]): Observable<Course[]> {
        let options = new RequestOptions({ headers: ContentHeaders });
        let data = {
        	userId: userId,
        	courses: courses
        }

        return this.http.post(this.url + '/' + userId + '/subjects', data, options)
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