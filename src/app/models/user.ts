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
	privilege: number;
	createdDate: Date;
	updateDate: Date;
	sex: number;
	profilePhoto: string;
	backPhoto: string;
	institute: Institute[];
	setting: {
		notifEmail: boolean;
		msmColor: string;
		primaryColor: string;
		theme: number;
	};
	photos: [{
		name: string,
		description: string,
		uploadDate: Date,
		tags: string[],
		album: string,
	}];
	courses: Course[];
};