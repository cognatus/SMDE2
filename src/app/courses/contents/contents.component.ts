import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthGuard } from '../../auth/auth.guard';

import { Colors } from '../../app.constants';

@Component({
	selector: 'app-contents',
	templateUrl: './contents.component.html',
	styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {
	colors = new Colors();

	constructor(private auth: AuthGuard) {}

	ngOnInit() {
	}

}
