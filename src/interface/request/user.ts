export interface IRegisterBody {
	name: string;
	email: string;
	password: string;
}

export interface ILoginBody {
	email: string;
	password: string;
}

export interface IForgotPasswordBody {
	email: string;
}

export interface IVerifyCodeBody {
	email: string;
	code: string;
}

export interface IResetPasswordBody {
	password: string;
}

export interface IUpdateProfileBody {
	name?: string;
	email?: string;
	password?: string;
	height?: number;
	weight?: number;
	gender?: string;
}

export interface IGetUsersQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IUpdateUserBody {
	name?: string;
	email?: string;
	isAdmin?: boolean;
}

export interface IAddFavoriteBody {
	productId: string;
}

export interface IGetFavoritesQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetUsersForTestingQuery {
	type: "personalization" | "outfit-suggestions";
	pageNumber?: number;
	perPage?: number;
}

