export class User {
	id: string;
	mail: string;
	password: string;
	name: string;
	lastName: string;
	phone: number;
	birthDay: string;
	userType: number;
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