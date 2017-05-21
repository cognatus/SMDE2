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
	courses: [{
		subject: {
			id: string;
			level: number;
			name: string;
		};
		group: {
			id: string;
			level: number;
			name: string;
		}
	}];
};