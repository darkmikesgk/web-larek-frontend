# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта;
- src/components/ — папка с JS компонентами;
- src/components/base/ — папка с базовым кодом;

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы;
- src/scss/styles.scss — корневой файл стилей;
- src/types/index.ts — файл с типами;
- src/utils/constants.ts — файл с константами;
- src/utils/utils.ts — файл с утилитами;
- src/index.ts — точка входа приложения;

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Интерфейсы и типы данных, используемые в приложении:

#### Карточка товара:

```ts
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

#### Предварительный просмотр карточки:

```ts
export interface IPreviewProduct extends IProductItem {
	valid: boolean;
	state: boolean;
}
```

#### Каталог товаров:

```ts
export interface IProductList {
	total: number;
	items: IProductItem[];
}
```

#### Продукт в корзине:

```ts
export interface IBasketProduct
	extends Omit<IProductItem, 'description' | 'image' | 'category'> {
	index: number;
}
```

#### Интерфейс описания способа оплаты и адреса доставки:

```ts
export interface IDelivery {
	payment: TPaymentMethod;
	adress: string;
}
```

#### Интерфейс ввода адреса электронной почты и номера телефона:

```ts
export interface IBuyerContacts {
	email: string;
	phone: string;
}
```

#### Список заказов:

```ts
export interface IOrderList {
	total: number;
	items: string[];
}
```

#### Интерфейс для данных заказа:

```ts
export interface IOrderData extends IDelivery, IBuyerContacts, IOrderList {}
```

#### Интерфейс построения заказа:

```ts
export interface IOrderBuilder {
	delivery: IDelivery;
	contacts: IBuyerContacts;
	orderList: IOrderList;
	result: IOrderData;
}
```

#### Интерфейс успешного оформления заказа:

```ts
export interface IOrderSuccess {
	id: string;
	total: number;
}
```

#### Интерфейс для состояния формы:

```ts
export interface IFormState {
	valid: boolean;
	error: string;
}
```

#### Интерфейс для формы:

```ts
export interface IForm extends IFormState {
	render(data?: IFormState): HTMLElement;
}
```

#### Интерфейс для данных ввода:

```ts
export interface IInputData {
	field: string;
	value: string;
}
```

Данные карточки, используемые при отображении на главной странице:

```ts
export type TProductCard = Omit<IProductItem, 'description'>;
```

Выбор способа оплаты: "На сайте" или "При получении":

```ts
export type TPaymentMethod = 'online' | 'cash';
```
