export interface Paging {
	page: number;
	size: number;
}

export interface Page<T> {
	data: T[];
	total: number;
}
