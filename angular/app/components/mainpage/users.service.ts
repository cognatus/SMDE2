import { User } from '../../models/user';
import { Configuration } from '../../app.constants';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService{
	constructor(private http: Http, private config: Configuration) {}

	getUsers(){
		return this.http.get(this.config.ApiRest + 'users')
			.map( response => <User[]> response.json() )
	}

}