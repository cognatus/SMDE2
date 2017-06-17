import { User } from './user';

export class Notification {
	_id: string;
	responsibleUsers: User[];
	actionOn: string;
	text: string;
	date: Date;
	redirect: string;
	read: boolean;
};