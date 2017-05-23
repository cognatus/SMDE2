import { Course } from './course';
import { Institute } from './institute';

export class User {
	_id: string;
	mail: string;
	password: string;
	name: string;
	lastName: string;
	phone: number;
	birthDay: Date;
	userType: number;
	createdDate: Date;
	sex: number;
	institute: Institute[];
	setting: {
		notifEmail: boolean;
		msmColor: string;
		primaryColor: string;
		theme: number;
	}
	courses: Course[];
};