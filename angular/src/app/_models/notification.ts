import { User } from './user';

export class Notification {
	_id: string;
	responsibleUsers: User[];
	action: {
		status: number;
		substatus: number;
		element: string;
	}
	date: Date;
	redirect: string;
	read: boolean;
};