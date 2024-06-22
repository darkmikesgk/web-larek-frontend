import { Api, ApiListResponse } from './base/api';
import {
	IProductItem,
	TOrderData,
	IOrderSuccess,
} from '../types';

// Интерфейс для работы с API, с помощью которого мы получаем список товаров, товар и можем оформлять заказ
export interface IWebLarekApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProduct:(order: TOrderData) => Promise<IOrderSuccess>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get(`/product`).then(
      (data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then(
      (item: IProductItem) => ({
			...item,
			image: this.cdn + item.image,
			})
    );
	}

  orderProduct(order: TOrderData): Promise<IOrderSuccess> {
    return this.post(`/order`, order).then(
      (data: IOrderSuccess) => data
    );
  }
}
