import { Component, OnInit } from '@angular/core';
import { Configuration } from './../../app.constants';

@Component({
	moduleId: module.id,
    selector: 'app-bar',
    templateUrl: 'appbar.component.html',
    styleUrls: ['appbar.component.css']
})
export class AppBarComponent {

	constructor(private config: Configuration){}

}