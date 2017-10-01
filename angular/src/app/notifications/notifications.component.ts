import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

import { Notification } from '../_models/notification';
import { User } from '../_models/user'; 
import { Colors, NOTIFICATION_TEXTS } from '../app.constants';

import { toggleHeight } from '../_animations/toggleSize';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css'],
	providers: [NotificationsService]
})
export class NotificationsComponent implements OnInit {
	notifications: Notification[] = [];
	disableScrollDown: boolean = false;
	countScroll: number = 0;
	offset: number = 8;
	isLoading: boolean;
	
	constructor(private auth: AuthGuard, 
		private notifService: NotificationsService,
		private router: Router) {}

	ngOnInit() {
		this.fetchNotif();
	}

	@HostListener('scroll', ['$event'])
	onScroll(event: Event): void {
		if ( this.scrolledBottom(event.target) ) {
			this.countScroll++;
			this.fetchNotif();
		}
	}

	scrolledBottom(element: any): boolean {
		return element.scrollHeight - element.scrollTop === element.clientHeight
	}

	fetchNotif(): void {
		this.isLoading = true;
		this.notifService.getNotifications(this.offset*this.countScroll)
			.subscribe( resp => {
				for ( let notif of resp ) {
					this.notifications.push(notif);
				}
				this.isLoading = false;
			}, error => {
				console.log(error);
			});
	}

	markRead(status: boolean, notif: Notification): void {
		this.notifService.setRead(notif._id, this.auth.getUser()._id, !notif.read)
			.subscribe( response => {
				if ( status ) {
					this.router.navigateByUrl(notif.redirect);
				} else {
					notif.read = !notif.read;
				}
			}, error => {
				console.log(error);
			});
	}

	getUnreadNotif() {
		let counter = 0;
		for ( let i in this.notifications ) {
			if ( !this.notifications[i].read ) {
				counter++;
			}
		}
		return counter;
	}

	getText(action) : string[] {
		let status = action.status;
		let substatus = action.substatus;
		let newText = [];
		let parts = NOTIFICATION_TEXTS[status].string[substatus].text.split('%e');
		let elements = action.element;

		for ( let i = 0 ; i < parts.length ; i++ ) {
			newText.push({ text: parts[i], elem: false });
			if ( elements[i] && elements[i] !== '' ) {
				newText.push({ text: elements[i], elem: true });
			}
		}

		return newText;
	}

}
