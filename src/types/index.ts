//Интерфейс для продукта
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IModalData {
	content: HTMLElement;
}

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

// Интерфейс успешного заказа
export interface IOrderSuccess {
	total: number;
}

export interface IProductCardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductCard {
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	button?: string;
	status: boolean;
}

export interface ItemProductBasket {
	title: string;
	price: number;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
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

//тип данных бизнес логики
export interface IAppState {
  catalog: IProductItem[];
  basket: string[];
  preview: string | null;
  loading: boolean;
}

export interface ISuccessActions {
	onClick: () => void;
}

// Интерфейс для работы с API, с помощью которого мы получаем список товаров, товар и можем оформлять заказ
export interface IWebLarekApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProduct:(order: TOrderData) => Promise<IOrderSuccess>;
}

//Тип для карточки каталога (исключая описание, через Omit)
export type TProductCard = Omit<IProductItem, 'description'>;

//Тип оплаты
export type TPaymentMethod = 'online' | 'upon receipt';

//Тип для данных заказа
export type TOrderData = IDelivery & IBuyerContacts & IOrderList;

//Тип записи об ошибке в форме
export type FormErrors = Partial<Record<keyof TOrderData, string>>;