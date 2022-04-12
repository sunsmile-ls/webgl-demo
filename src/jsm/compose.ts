import Track from './Track';
export interface ComposeType {
	parent: ComposeType | null;
	children: Array<Track>;
	add(obj: Track): void;
	update(t: number): void;
}
export default class Compose implements ComposeType {
	parent: ComposeType | null;
	children: Array<Track>;

	constructor() {
		this.parent = null;
		this.children = [];
	}

	add(obj: Track) {
		obj.parent = this as ComposeType;
		this.children.push(obj);
	}

	update(t: number) {
		this.children.forEach(ele => {
			ele.update(t);
		});
	}
}

