//Интерфейс для продукта
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | string;
}

//Интерфейс для предварительного просмотра карточки
export interface IPreviewProduct extends IProductItem {
	valid: boolean;
	state: boolean;
}

//Интерфейс для каталога карточек
export interface IProductList {
	total: number;
	items: IProductItem[];
}

//Интерфейс для продукта в корзине
export interface IBasketProduct
	extends Omit<IProductItem, 'description' | 'image' | 'category'> {
	index: number;
}

//Интерфейс для информации о доставке
export interface IDelivery {
	payment: TPaymentMethod;
	adress: string;
}

//Интерфейс для контактных данных
export interface IBuyerContacts {
	email: string;
	phone: string;
}

//Интерфейс для списка заказов
export interface IOrderList {
	total: number;
	items: string[];
}

//Интерфейс для данных заказа
export interface IOrderData extends IDelivery, IBuyerContacts, IOrderList {}

//Интерфейс построения заказа
export interface IOrderBuilder {
	delivery: IDelivery;
	contacts: IBuyerContacts;
	orderList: IOrderList;
	result: IOrderData;
}

// Интерфейс успешного заказа
export interface IOrderSuccess {
	id: string;
	total: number;
}

// Интерфейс для состояния формы
export interface IFormState {
	valid: boolean;
	error: string;
}

// Интерфейс для формы
export interface IForm extends IFormState {
	render(data?: IFormState): HTMLElement;
}

// Интерфейс для данных ввода
export interface IInputData {
	field: string;
	value: string;
}

//Тип для карточки каталога (исключая описание, через Omit)
export type TProductCard = Omit<IProductItem, 'description'>;

//Тип оплаты
export type TPaymentMethod = 'online' | 'cash';