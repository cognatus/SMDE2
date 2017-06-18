import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

import { Notification } from '../models/notification';
import { User } from '../models/user'; 
import { Colors, notificationTexts } from '../app.constants';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css'],
	providers: [NotificationsService]
})
export class NotificationsComponent implements OnInit {
	notifications: Notification[];

	constructor(private auth: AuthGuard, private notifService: NotificationsService) {}

	ngOnInit() {
		this.fetchNotif();
	}

	fetchNotif(): void {
		this.notifService.getNotifications()
			.subscribe( notifications => {
				this.notifications = notifications;
			}, error => {
				console.log(error);
			});
	}

	markRead(status: boolean, notif: Notification): void {
		this.notifService.setRead(notif._id, this.auth.getUser()._id)
			.subscribe( response => {
				if ( status ) {
					location.href = notif.redirect;
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

	getText(action, index) : string {
		let status = action.status;
		let substatus = action.substatus;

		let parts = notificationTexts[status].string[substatus].text.split('%e');

		if ( index != undefined && parts.length > 1 ) {
			return parts[index];
		} else {
			return parts[0];
		}
	}

}
