import { IProduct } from "./product";

export interface IRecommendationResponse {
	success: boolean;
	data: {
		products: IProduct[];
		model: string;
		timestamp: string;
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
	message: string;
}

export interface IOutfitProduct {
	_id: string;
	name: string;
	price: number;
	image?: string;
	images?: string[];
}

export interface IOutfit {
	name: string;
	products: IOutfitProduct[];
	style: string;
	totalPrice: number;
	compatibilityScore: number;
	gender: string;
	description: string;
}

export interface IOutfitRecommendationResponse {
	success: boolean;
	data: {
		outfits: IOutfit[];
		model: string;
		timestamp: string;
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
	message: string;
}

export interface ISimilarProductsResponse {
	success: boolean;
	data: {
		originalProduct: IProduct;
		similarProducts: IProduct[];
		count: number;
		pagination: {
			page: number;
			pages: number;
			totalCount: number;
			perPage: number;
		};
	};
	message: string;
}

export interface ITrendingProductsResponse {
	success: boolean;
	data: {
		trendingProducts: IProduct[];
		period: string;
		count: number;
		pagination: {
			page: number;
			pages: number;
			totalCount: number;
			perPage: number;
		};
	};
	message: string;
}

export interface IPersonalizedResponse {
	success: boolean;
	data: {
		products: IProduct[];
		userPreferences: Record<string, any>;
		count: number;
	};
	message: string;
}

export interface ITrainModelsResponse {
	success: boolean;
	data: {
		gnn: {
			trained: boolean;
			trainingTime: string;
		};
		hybrid: {
			trained: boolean;
			trainingTime: string;
		};
	};
	message: string;
}

