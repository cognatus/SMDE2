import { User } from './user';

export class Course {
	_id: string;
	name: string;
	description: string;
	tags: string[];
	createdDate: Date;
	private: boolean;
	updatedDate: Date;
	user: User;
	members: User[];
	color: String;
};