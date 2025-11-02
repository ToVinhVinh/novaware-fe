export interface IOrderItem {
	product: string;
	name: string;
	image?: string;
	images?: string[];
	price: number;
	priceSale?: number;
	qty: number;
	sizeSelected: string;
	colorSelected?: string;
}

export interface IShippingAddress {
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

export interface IOrder {
	_id: string;
	user?: {
		_id: string;
		name: string;
		email: string;
	};
	orderItems: IOrderItem[];
	shippingAddress: IShippingAddress;
	paymentMethod: string;
	paymentResult?: {
		id: string;
		status: string;
		update_time: string;
		email_address: string;
	};
	itemsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalPrice: number;
	isPaid: boolean;
	paidAt?: string;
	isDelivered: boolean;
	deliveredAt?: string;
	isCancelled?: boolean;
	cancelledAt?: string;
	isConfirmed?: boolean;
	confirmedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ICreateOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IGetOrdersResponse {
	message: string;
	data: {
		orders: IOrder[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IUpdateOrderToPaidResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IUpdateOrderToDeliveredResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface ICancelOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IConfirmOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

