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

## Данные и типы данных, используемые в приложении:

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

#### Интерфейс для работы API. С его помозью мы получаем список товаров, товар и можем оформить заказ:

```ts
export interface IWebLarekApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	postOrder(order: IOrderData): Promise<IOrderSuccess>;
}
```

#### Данные карточки, используемые при отображении на главной странице:

```ts
export type TProductCard = Omit<IProductItem, 'description'>;
```

#### Выбор способа оплаты: "На сайте" или "При получении":

```ts
export type TPaymentMethod = 'online' | 'upon receipt';
```

#### Тип для данных заказа:

```ts
export type IOrderData = IDelivery & IBuyerContacts & IOrderList;
```

## Архитектура приложения

Проект основывается на архитектуре **Model-View-Presentor** (MVP) и включает в себя:

* **Model** - слой данных, отвечающая за хранение и обработку информации.
* **View** - слой представления, который отвечает за отображение данных в UI элементах страницы.
* **Presentor** - слой представления, который соединяет модель и отображение.

### Базовый код

#### Класс API

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы: 
- `handleResponse(response: Response): Promise<object>` - обрабатывает ответ с сервера. Если ответ с сервера положительный, то возвращается json, иначе - ошибка.
- `get(uri: string)` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - подписка на событие.
- `off(eventName: EventName, callback: Subscriber)` - отписка от события.
- `emit<T extends object>(eventName: string, data?: T)` - инициализация события.
- `onAll(callback: (event: EmitterEvent) => void)` - подписка на все события.
- `offAll()` - сброс всех обработчиков.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.