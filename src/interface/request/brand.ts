export interface IGetBrandsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface ICreateBrandBody {
	name: string;
}

export interface IUpdateBrandBody {
	name: string;
}

