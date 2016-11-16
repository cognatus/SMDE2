import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	public Server: string = 'http://localhost:3000/';
	public ApiUrl: string = 'api/';
	public ApiRest: string = this.Server + this.ApiUrl;
}