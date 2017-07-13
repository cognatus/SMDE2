import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../../common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiUrl } from '../../app.constants';
import { User } from '../../_models/user';
import { Course } from '../../_models/course';

@Injectable()
export class CourseDetailService {
	url = ApiUrl + 'courses/';
	constructor(private http: Http) {}

	getCourse(id): Observable<Course> {
		return this.http.get(this.url + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	updateGroup(group: any, id: string): Observable<any> {
		let options = new RequestOptions({ headers: ContentHeaders });
		let data = { name: group.name, users: [] };

		for ( let item in group.users ) {
		 	data.users.push(group.users[item].id);
		}

		if ( group.isNew ) {
			return this.http.post(this.url + id +'/updategroup', data, options)
				.map(this.extractData)
				.catch(this.handleError);
		} else {
			return this.http.put(this.url + id +'/updategroup/' + group.id, data, options)
				.map(this.extractData)
				.catch(this.handleError);
		}
	}

	deleteGroup(courseId: string, groupId: any) {
		let options = new RequestOptions({ headers: ContentHeaders });

		return this.http.delete(this.url + courseId + '/updategroup/' + groupId , options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	suscribeCourse(status: boolean, id: string, user: User, group: string): Observable<Course> {
		let options = new RequestOptions({ headers: ContentHeaders });
		let data = {
			id: user._id,
			group: group
		}

		if ( status ) {
			return this.http.post(this.url + id + '/suscribe', data, options)
				.map(this.extractData)
				.catch(this.handleError);
		} else {
			return this.http.delete(this.url + id + '/suscribe', options)
				.map(this.extractData)
				.catch(this.handleError);
		}
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