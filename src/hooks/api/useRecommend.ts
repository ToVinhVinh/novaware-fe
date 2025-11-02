import { useQuery, useMutation } from '@tanstack/react-query';
import {
	getGNNRecommendations,
	getHybridRecommendations,
	getBestRecommendations,
	getOutfitRecommendations,
	getSimilarProducts,
	getTrendingProducts,
	getPersonalizedRecommendations,
	trainModels,
} from '../../lib/api/recommend';
import * as RecommendTypes from '../../interface/response/recommend';
import * as RecommendRequestTypes from '../../interface/request/recommend';

export const useGetGNNRecommendations = (userId: string, query?: RecommendRequestTypes.IGetRecommendationsQuery) => {
	return useQuery<RecommendTypes.IRecommendationResponse, Error>({
		queryKey: ['recommend', 'gnn', userId, query],
		queryFn: () => getGNNRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useGetHybridRecommendations = (userId: string, query?: RecommendRequestTypes.IGetRecommendationsQuery) => {
	return useQuery<RecommendTypes.IRecommendationResponse, Error>({
		queryKey: ['recommend', 'hybrid', userId, query],
		queryFn: () => getHybridRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useGetBestRecommendations = (userId: string, query?: RecommendRequestTypes.IGetRecommendationsQuery) => {
	return useQuery<RecommendTypes.IRecommendationResponse, Error>({
		queryKey: ['recommend', 'best', userId, query],
		queryFn: () => getBestRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useGetOutfitRecommendations = (userId: string, query?: RecommendRequestTypes.IGetRecommendationsQuery) => {
	return useQuery<RecommendTypes.IOutfitRecommendationResponse, Error>({
		queryKey: ['recommend', 'outfits', userId, query],
		queryFn: () => getOutfitRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useGetSimilarProducts = (productId: string, query?: RecommendRequestTypes.IGetSimilarProductsQuery) => {
	return useQuery<RecommendTypes.ISimilarProductsResponse, Error>({
		queryKey: ['recommend', 'similar', productId, query],
		queryFn: () => getSimilarProducts(productId, query),
		enabled: !!productId,
	});
};

export const useGetTrendingProducts = (query?: RecommendRequestTypes.IGetTrendingQuery) => {
	return useQuery<RecommendTypes.ITrendingProductsResponse, Error>({
		queryKey: ['recommend', 'trending', query],
		queryFn: () => getTrendingProducts(query),
	});
};

export const useGetPersonalizedRecommendations = (userId: string, query?: RecommendRequestTypes.IGetPersonalizedQuery) => {
	return useQuery<RecommendTypes.IPersonalizedResponse, Error>({
		queryKey: ['recommend', 'personalized', userId, query],
		queryFn: () => getPersonalizedRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useTrainModels = () => {
	return useMutation<RecommendTypes.ITrainModelsResponse, Error>({
		mutationFn: trainModels,
	});
};

