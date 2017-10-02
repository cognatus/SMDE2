import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Alert } from '../_models/alert';

import { fade } from '../_animations/fade';

declare let $: any;
@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.css'],
	animations: [fade]
})
export class ConfirmationComponent implements OnInit {

	@Input() alert: Alert;
	@Output() onSelection = new EventEmitter<boolean>();

	constructor() {}

	ngOnInit() {
	}

	accept(): void {
		this.onSelection.emit(true);
		this.hideAlert();
	}

	cancel(): void {
		this.onSelection.emit(false);
		this.hideAlert();
	}

	private showAlert(){
    	$('#confirm-box').modal('show');
  	}

	private hideAlert() {
		$('#confirm-box').modal('hide');
	}

}
