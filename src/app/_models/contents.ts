export class Contents {
	name: string;
	content: string;
	subsection: [{
		name: string;
		content: string;
		createdDate: string;
		updatedDate: string;
	}];
	files: [{
		name: string;
		uploadedDate: Date;
	}];
	createdDate: Date;
	updatedDate: Date;
}