import { User } from './user';

export class Course {
	_id: string;
	name: string;
	description: string;
	tags: string[];
	createdDate: Date;
	isPrivate: boolean;
	updatedDate: Date;
	user: User;
	members: [{
		group: string;
		user: User;
	}];
	activities: [{
		title: string;
		member: [{
			id: string;
			qualification: { type: Number; required: true };
		}];
		quiz: [{
			field: [{
				question: {
					title: string;
					position: number;
				};
				answers: [{
					title: string
				}];
				openAnswer: { type: string };
				quantity: number;
			}];
			quantity: number;
		}];
		quantity: number;
		createdDate: Date;
		updatedDate: Date;
	}];
	section: [{
		name: string;
		subsection: [{
			name: string;
		}];
		files: [{
			name: string;
		}];
	}];
	color: string;
};