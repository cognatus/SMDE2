import { Course } from './course';
import { Institute } from './institute';

export class User {
	_id: string;
	id: string;
	mail: string;
	name: string;
	lastName: string;
	phone: number;
	birthDay: Date;
	privilege: number;
	sex: number;
	createdDate: Date;
	updateDate: Date;
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
	profilePhoto: string;
	backPhoto: string;
};