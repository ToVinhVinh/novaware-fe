export interface ICategory {
	_id: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IGetCategoriesResponse {
	message: string;
	data: {
		categories: ICategory[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetCategoryCountsResponse {
	message: string;
	data: {
		categoryCounts: Array<{
			name: string;
			count: number;
		}>;
		page: number;
		pages: number;
		count: number;
	};
}

export interface ICreateCategoryResponse {
	message: string;
	data: {
		category: ICategory;
	};
}

export interface IUpdateCategoryResponse {
	message: string;
	data: {
		category: ICategory;
	};
}

export interface IDeleteCategoryResponse {
	message: string;
}

