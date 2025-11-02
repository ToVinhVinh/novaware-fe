import { sendGet, sendPost } from "./axios";
import {
	IRecommendationResponse,
	IOutfitRecommendationResponse,
	ISimilarProductsResponse,
	ITrendingProductsResponse,
	IPersonalizedResponse,
	ITrainModelsResponse,
} from "../../interface/response/recommend";
import {
	IGetRecommendationsQuery,
	IGetTrendingQuery,
	IGetSimilarProductsQuery,
	IGetPersonalizedQuery,
} from "../../interface/request/recommend";

export const getGNNRecommendations = async (userId: string, query?: IGetRecommendationsQuery): Promise<IRecommendationResponse> => {
	return await sendGet(`/recommend/gnn/${userId}`, query);
};

export const getHybridRecommendations = async (userId: string, query?: IGetRecommendationsQuery): Promise<IRecommendationResponse> => {
	return await sendGet(`/recommend/hybrid/${userId}`, query);
};

export const getBestRecommendations = async (userId: string, query?: IGetRecommendationsQuery): Promise<IRecommendationResponse> => {
	return await sendGet(`/recommend/best/${userId}`, query);
};

export const getOutfitRecommendations = async (userId: string, query?: IGetRecommendationsQuery): Promise<IOutfitRecommendationResponse> => {
	return await sendGet(`/recommend/outfits/${userId}`, query);
};

export const getSimilarProducts = async (productId: string, query?: IGetSimilarProductsQuery): Promise<ISimilarProductsResponse> => {
	return await sendGet(`/recommend/similar/${productId}`, query);
};

export const getTrendingProducts = async (query?: IGetTrendingQuery): Promise<ITrendingProductsResponse> => {
	return await sendGet(`/recommend/trending`, query);
};

export const getPersonalizedRecommendations = async (userId: string, query?: IGetPersonalizedQuery): Promise<IPersonalizedResponse> => {
	return await sendGet(`/recommend/personalized/${userId}`, query);
};

export const trainModels = async (): Promise<ITrainModelsResponse> => {
	return await sendPost(`/recommend/train`);
};

