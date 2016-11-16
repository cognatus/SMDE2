import { Component, OnInit } from '@angular/core';
import { Configuration } from './../../app.constants';

@Component({
	moduleId: module.id,
    selector: 'login-component',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {

	constructor(private config: Configuration){}

}