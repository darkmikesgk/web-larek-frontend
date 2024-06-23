import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	IBuyerContacts,
	TOrderData,
	IProductItem,
	TPaymentMethod,
} from '../types';
import { IEvents } from './base/events';

export type CatalogChangesEvents = {
	catalog: Product[];
};

export class Product extends Model<IProductItem> implements IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}

export class AppState extends Model<IAppState> {
	catalog: IProductItem[] = [];
	basket: IProductItem[] = [];
	preview: string | null = null;
	order: TOrderData;
	loading: boolean = false;
	formErrors: FormErrors = {};

	constructor(data: Partial<IAppState>, protected events: IEvents) {
		super(data, events);
		this.resetOrder();
	}

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

	addProduct(item: IProductItem): void {
		this.basket.push(item);
		this.emitChanges('basket:isChanged');
	}

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

	setContactField(field: keyof IBuyerContacts, value: string): void {
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

	clearBasket(): void {
		this.basket = [];
		this.resetOrder();
		this.emitChanges('basket:isChanged');
	}

	getTotal(): number {
		return this.basket.reduce((total, item) => total + (item.price ?? 0), 0);
	}

	orderSuccess(): void {
		this.order.total = this.getTotal();
		this.order.items = this.getOrderedProducts().map((item) => item.id);
	}

	validateDelivery(): void {
		const errors: FormErrors = {};

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
		const errors: FormErrors = {};

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
