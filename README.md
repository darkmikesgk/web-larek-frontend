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
	orderProduct:(order: IOrderData) => Promise<IOrderSuccess>;
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

## Базовый код

### Класс API

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

#### Методы: 
- `handleResponse(response: Response): Promise<object>` - обрабатывает ответ с сервера. Если ответ с сервера положительный, то возвращается json, иначе - ошибка.
- `get(uri: string)` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

### Класс EventEmitter

Брокер событий. Позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

#### Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - подписка на событие.
- `off(eventName: EventName, callback: Subscriber)` - отписка от события.
- `emit<T extends object>(eventName: string, data?: T)` - инициализация события.
- `onAll(callback: (event: EmitterEvent) => void)` - подписка на все события.
- `offAll()` - сброс всех обработчиков.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Класс Component

Класс представляет собой абстрактный базовый компонент для создания пользовательского интерфейса. Он предоставляет основные методы для управления DOM-элементами, такие как отрисовка компонента, переключение классов, установка текста и изображений.

#### Конструктор класса принимает:
- `container: HTMLElement` - HTML-элемент, который будет использоваться как контейнер для компонента. Это обеспечивает базу для взаимодействия с DOM;

#### Класс предоставляет следующий набор методов: 
-	`render(data?: Partial<T>): HTMLElement` - используется для отображения компонента. Он может принимать необязательный параметр data, который позволяет обновить состояние компонента перед его отрисовкой. Возвращает корневой DOM-элемент компонента;
-	`toggleClass(element: HTMLElement, className: string, force?: boolean)` - добавляет или удаляет CSS-класс у указанного элемента. Параметр force опциональный и может быть использован для принудительного добавления или удаления класса.
-	`setText(element: HTMLElement, value: unknown)` - метод устанавливает текстовое содержимое для указанного элемента.
- `setDisabled(element: HTMLElement, state: boolean)` - изменяет статус блокировки элемента. Если state истинно, элемент будет заблокирован, иначе разблокирован.
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает источник изображения и альтернативный текст (опционально) для HTML-элемента изображения.

### Класс Model

Представляет собой абстрактный базовый класс, который определяет общую структуру и поведение моделей в приложении.

#### Конструктор класса принимает:
- `data: Partial<T>` - объект, который может содержать часть свойств типа T. Свойства из data копируются в экземпляр класса с помощью Object.assign;
- `events: IEvents` - брокер событий, который поддерживает интерфейс IEvents;

#### Метод, реализуемый классом: 
-	`emitChanges(event: string, payload?: object)` - метод используется для генерации событий об изменении модели. Принимает имя события event и опциональный параметр payload. Если payload не предоставлен, используется пустой метод. Вызывает функцию emit из объекта events, передавая ей event и payload.

## Классы представления



