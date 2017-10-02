import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { ContentHeaders } from '../_common/headers';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { API_URL } from '../app.constants';
import { User } from '../_models/user';

@Injectable()
export class AdminService {
	constructor(private http: Http) {}
}