import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
	IGetBrandsResponse,
	ICreateBrandResponse,
	IUpdateBrandResponse,
	IDeleteBrandResponse,
} from "../../interface/response/brand";
import {
	IGetBrandsQuery,
	ICreateBrandBody,
	IUpdateBrandBody,
} from "../../interface/request/brand";

export const getBrands = async (query?: IGetBrandsQuery): Promise<IGetBrandsResponse> => {
	return await sendGet(`/brands`, query);
};

export const createBrand = async (body: ICreateBrandBody): Promise<ICreateBrandResponse> => {
	return await sendPost(`/brands`, body);
};

export const updateBrand = async (id: string, body: IUpdateBrandBody): Promise<IUpdateBrandResponse> => {
	return await sendPut(`/brands/${id}`, body);
};

export const deleteBrand = async (id: string): Promise<IDeleteBrandResponse> => {
	return await sendDelete(`/brands/${id}`);
};

