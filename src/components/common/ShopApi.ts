import { IShopApi, IProduct, IOrderData, IOrderResult } from '../../types';
import { Api, ApiListResponse } from '../base/Api';

class ShopApi extends Api implements IShopApi {
	protected readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	postOrder(order: IOrderData): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}

export { ShopApi };