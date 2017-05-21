import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import { ApiUrl } from '../app.constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';    

@Injectable()
export class SignupService {

    constructor(private http: Http) {}

    signup(user) {
        let body = JSON.stringify({ user });
        let options = new RequestOptions({ headers: ContentHeaders });
        
        return this.http.post(ApiUrl + 'signup', body, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    private extractData(res: Response) {
		let body = res.json();
        return body.data || {};
    }
    private handleErrorObservable (error: Response | any) {
		console.error(error.message || error);
		return Observable.throw(error.message || error);
    }
    private handleErrorPromise (error: Response | any) {
		console.error(error.message || error);
		return Promise.reject(error.message || error);
    }

}