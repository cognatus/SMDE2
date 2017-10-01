import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { fade } from '../_animations/fade';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.css'],
	animations: [fade]
})
export class ConfirmationComponent implements OnInit {

	@Input() message: string;
	@Output() onSelection = new EventEmitter<boolean>();

	constructor() {}

	ngOnInit() {
	}

	accept(): void {
		this.onSelection.emit(true);
	}

	cancel(): void {
		this.onSelection.emit(false);
	}

}
