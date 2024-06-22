//Интерфейс для продукта
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	//status: boolean;
}

//Интерфейс для предварительного просмотра карточки
export interface IPreviewProduct extends IProductItem {
	valid: boolean;
	state: boolean;
}

// //Интерфейс для каталога карточек
// export interface IProductList {
// 	total: number;
// 	items: IProductItem[];
// 	getProductItem(id: string): void;
// 	getProductList(items: IProductItem[]): void;
// }

//Интерфейс для продукта в корзине
// export interface IBasketProduct
// 	extends Omit<IProductItem, 'description' | 'image' | 'category'> {
// 	index?: number;
// }

//Интерфейс для информации о доставке
export interface IDelivery {
	payment: TPaymentMethod;
	address: string;
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

//Интерфейс построения заказа
export interface IOrderBuilder {
	delivery: IDelivery;
	contacts: IBuyerContacts;
	orderList: IOrderList;
	result: TOrderData;
}

// Интерфейс успешного заказа
export interface IOrderSuccess {
//	id: string;
	total: number;
}

// Интерфейс для состояния формы
export interface IFormState {
	valid: boolean;
	errors: string[];
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

// // Интерфейс для работы с API, с помощью которого мы получаем список товаров, товар и можем оформлять заказ
// export interface IWebLarekApi {
// 	getProductList: () => Promise<IProductItem[]>;
// 	getProductItem: (id: string) => Promise<IProductItem>;
// 	orderProduct:(order: IOrderData) => Promise<IOrderSuccess>;
// }

//тип данных бизнес логики
export interface IAppState {
  catalog: IProductItem[];
  basket: string[];
  preview: string | null;
  order: IOrderBuilder | null;
  loading: boolean;
}

//Тип для карточки каталога (исключая описание, через Omit)
export type TProductCard = Omit<IProductItem, 'description'>;

//Тип оплаты
export type TPaymentMethod = 'online' | 'upon receipt';

//Тип для данных заказа
export type TOrderData = IDelivery & IBuyerContacts & IOrderList;

//Тип записи об ошибке в форме
export type FormErrors = Partial<Record<keyof TOrderData, string>>;