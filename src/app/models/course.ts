import { User } from './user';

export class Course {
	_id: string;
	name: string;
	description: string;
	tags: string[];
	createdDate: Date;
	updatedDate: Date;
	user: User;
	color: String;
};