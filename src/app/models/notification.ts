import { User } from './user';

export class Notification {
	_id: string;
	responsibleUsers: User[];
	action: {
		status: number;
		substatus: number;
		id: string;
		element: string;
	}
	actionOn: string; // nombre de usurario, curso, etc
	date: Date;
	redirect: string;
	read: boolean;
};