import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiUrl } from '../app.constants';
import { Course } from '../models/course';

@Injectable()
export class CoursesService {
	url = ApiUrl + 'courses';
	constructor(private http: Http ) {}

	getCourses(): Observable<Course[]> {
		return this.http.get(this.url)
			.map(this.extractData)
			.catch(this.handleError);
	}

	addCourses(courses: Course[]): Observable<Course[]> {
        let options = new RequestOptions({ headers: ContentHeaders });
        let dataArray = [];
        let data = '';

        dataArray = courses;
        dataArray.forEach( (item) => {
        	delete item._id;
        	delete item.subject._id;
        	delete item.group._id;
        });
      
        data = JSON.stringify(dataArray);

        return this.http.post(this.url, data, options)
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