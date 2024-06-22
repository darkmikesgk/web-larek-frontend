import {
	FormErrors,
	IAppState,
	IBuyerContacts,
	TOrderData,
	IProductItem,
	TPaymentMethod,
} from '../types';
import { Model } from './base/Model';
import { IEvents } from './base/events';

export class Product extends Model<IProductItem> implements IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}

export type CatalogChangesEvents = {
	catalog: Product[];
};

export class AppState extends Model<IAppState> {
	catalog: IProductItem[];
	basket: IProductItem[];
	preview: string | null;
	order: TOrderData;
	loading: boolean;
	formErrors: FormErrors = {};

	constructor(data: Partial<IAppState>, protected events: IEvents) {
		super(data, events);
		this.resetOrder();
		this.basket = [];
	}

	//Сброс заказов в начальное состояние
	resetOrder(): void {
		this.order = {
			payment: null,
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
		};
	}

	//Добавить товар
	addProduct(item: IProductItem): void {
		this.basket.push(item);
		this.emitChanges('basket:isChanged');
	}

	//Удалить товар
	deleteProduct(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('basket:isChanged');
	}

	setPaymentMethod(method: string): void {
		this.order.payment = method as TPaymentMethod;
		this.validateDelivery();
	}

	setAddress(value: string): void {
		this.order.address = value;
		this.validateDelivery();
	}

	//перепроверить
	setContactField(field: keyof Partial<IBuyerContacts>, value: string): void {
		this.order[field] = value;
		this.validateBuyerContacts();
	}

	setCatalog(items: IProductItem[]): void {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('catalog:isChanged', { catalog: this.catalog });
	}

	getOrderedProducts(): IProductItem[] {
		return this.basket;
	}

	orderStatus(item: IProductItem): boolean {
		return this.basket.includes(item);
	}

	//Очистить корзину
	clearBasket(): void {
		this.basket = [];
		this.resetOrder();
		this.emitChanges('basket:isChanged');
	}

	getTotal(): number {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	orderSuccess(): void {
		this.order.total = this.getTotal();
		this.order.items = this.getOrderedProducts().map((item) => item.id);
	}

	validateDelivery(): void {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('formDeliveryErrors:isChanged', this.formErrors);
	}

	validateBuyerContacts(): void {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Укажите email';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('formBuyerContactsErrors:isChanged', this.formErrors);
	}
}
