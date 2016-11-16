import { Component, OnInit } from '@angular/core';
import { Configuration } from './../../app.constants';

@Component({
	moduleId: module.id,
    selector: 'main-page',
    templateUrl: 'mainpage.component.html',
    styleUrls: ['mainpage.component.css']
})
export class MainPageComponent {

	constructor(private config: Configuration){}

}