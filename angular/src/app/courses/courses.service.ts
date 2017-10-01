import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { API_URL } from '../app.constants';
import { Course } from '../_models/course';

@Injectable()
export class CoursesService {
	url = API_URL + 'courses';
	constructor(private http: Http ) {}

	getCourses(): Observable<Course[]> {
		return this.http.get(this.url)
			.map(this.extractData)
			.catch(this.handleError);
	}

	addCourse(course: Course): Observable<Course> {
        let options = new RequestOptions({ headers: ContentHeaders });

        return this.http.post(this.url, course, options)
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