import { Subject } from './subject';
import { Group } from './group';

export class Course {
	_id: string;
	key: string;
	subject: Subject;
	group: Group;
};