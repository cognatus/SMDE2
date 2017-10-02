import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthHttp {

	constructor(private http: Http, private auth: AuthService) {}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', this.auth.getToken()); 
	}

	get(url) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.get(url, {
				headers: headers
			});
	}

	post(url, data) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.post(url, data, {
				headers: headers
			});
	}

	put(url, data) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.put(url, data, {
				headers: headers
			});
	}

	delete(url) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.delete(url, {
				headers: headers
			});
	}

}
