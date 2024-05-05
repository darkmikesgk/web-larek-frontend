# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

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
## Архитектура проекта

Проект основывается на архитектуре **Model-View-Presentor** (MVP) и включает в себя:

* **Model** - модель данных, отвечающая за хранение и обработку информации.
* **View** - отвечает за отображение данных в UI элементах страницы.
* **Presentor** - Соединяет модель и отображение, а так же следит за изменениями модели и передаёт их в представление и наоборот. В нашем случае не будет выделено отдельной сущности для этого, его роль будет выполнять код в index.ts.
Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

# Документация к архитектуре проекта.
## Базовый код:
### 1. Model
    Базовый абстрактный класс для всех классов - моделей для хранения и обработки данных, использует EventEmitter посредством ассоциации.
**Поля класса:**
* `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

**Конструктор принимает аргументы:**
* `data: Partial<T>` - объект с входными данными.
* `Partial` делает поля типа T опциональными.
* `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

**Методы класса:**
* `emitChanges(event: string, payload?: object)` - уведомляет подписчиков об изменениях модели и передаёт данные payload, для этого используется EventEmitter.

### 2. View
    Базовый абстрактный класс для всех классов - отображений и для отображения данных в UI элементах.
**Поля класса:**
* `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.

**Конструктор принимает аргументы:**

* `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.

**Методы класса:**
* `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключение класса className на переданном html элементе(element).
* `setText(element: HTMLElement, value: unknown)` - установка текста(value) в выбранный HTMLElement (element).
* `setDisabled(element: HTMLElement, state: boolean)` - блокирует переданный html элемент(element), если state === true. В ином случае снимает блокировку.
* `setHidden(element: HTMLElement)` - скрывает переданный html элемент(element).
* `setVisible(element: HTMLElement)` - отображает переданный html элемент(element).
* `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает url(аргумент src) в поле src переданного html элемента(element) и альтернативный текст(аргумент alt) в поле alt.
* `render(data?: Partial<T>): HTMLElement` - отрисовывает компонент на странице и возвращает корневой html элемент. Рендер осуществляется за счёт присваивания переданных данных текущему экземпляру класса. Классы, которые наследуются от View должны иметь набор сеттеров для корректной обработки такого присваивания.

### 3. EventEmitter
    Брокер событий. Реализует паттерн "Наблюдатель", позволяет подписываться на события и уведомлять подписчиков о наступлении события, поддерживает интерфейс IEvents.

**Поля класса:**

* `_events: Map<EventName, Set<Subscriber>>` - хранит события в виде Map, где ключём является строка или регулярное выражение, а значением сет коллбэков.

**Конструктор принимает аргументы:**

* Конструктор не принимает аргументов.

**Методы класса:**

* `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - для подписки на событие.
* `off(eventName: EventName, callback: Subscriber)` - для отписки от события.
* `emit<T extends object>(eventName: string, data?: T)` - для уведомления подписчиков о наступлении события.
* `onAll(callback: (event: EmitterEvent) => void)` - для подписки на все события.
* `offAll()` - для сброса всех подписчиков.
* `trigger<T extends object>(eventName: string, context?: Partial<T>)` - делает коллбек триггер, генерирующий событие при вызове.

### 4.  API
    Базовый класс для осуществления низкоуровневых операций с API.
**Поля класса:**

* `baseUrl: string` - базовый url на API.
* `options: RequestInit` - объект с настройками для формирования запроса.

**Конструктор принимает аргументы:**

* `baseUrl: string` - базовый url на API.
* `options: RequestInit` - объект с настройками для формирования запроса.

**Методы класса:**

* `get(uri: string)` - отправить get запрос на сервер.
* `post(uri: string, data: object, method: APIPostMethods = 'POST')` - отправить post запрос на сервер с данными data.
* `handleResponse(response: Response): Promise<object>` - обработка ответа с сервера. Если ответ с сервера в порядке, то возвращается json, в ином случае ошибка.
* `protected request(uri: string, options: RequestInit)` - универсальный метод запроса с проверкой ответа для использования в get и post методах.

## Взаимодействие между компонентами

* `Model` - управляет данными в приложении и взаимодействует с компонентами через события.
* `View` - базовый класс для всех компонентов UI.
* `EventEmitter` - механизм для управления событиями в приложении. Используется для взаимодействия между компонентами, моделями и API.
* `API` - методы для выполнения HTTP-запросов к удаленному API. Используется в компонентах для получения и отправки данных.

## Компоненты модели данных:
### 1. ShopAPI 
    Наследуется от базового класса API. Осуществляет работу API конкретно данного магазина, позволяет получить список товаров, конкретный товар или оформить заказ сервиса "Web ларёк".
**Поля класса:**

* `cdn: string` - url на изображения товаров.

**Конструктор принимает аргументы:**

* `cdn: string` - url на изображения товаров.
* `baseUrl: string` - базовый url на API.
* `options?: RequestInit` - объект с настройками для формирования запроса.

**Методы класса:**

* `getProductList(): IProductItem[]` - получает с сервера список товаров для дальнейшей передачи их в Catalog и отрисовки посредством CardView и CatalogView.
* `getProductItem(id: string)` - получает с сервера конкретный товар по id. Эти данные нужны для формирования заказа.
* `postOrder(order: IOrder): IOrderResult` - отправляет post запрос на сервер, содержащий данные о заказе. Для этого нужны данные о заказе (способ оплаты, адрес, email, телефон) и информация о купленных товарах(их id, общая стоимость).

### 2. Catalog 
    Наследуется от базового класса Model. Представляет собой модель для коллекции товаров на главной странице, используется для хранения и обработки данных о коллекции товаров. Хранит список объектов, которые поддерживают интерфейс IProduct(чтобы иметь доступ к методам конвертации). При добавлении объектов генерируется событие 'catalog:items-changed', по которому Card и Page отрисовывают список карточек.
**Поля класса:**

* `protected _items: IProduct[]` - массив объектов - товаров.

**Конструктор принимает аргументы:**

* `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
* `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

**Методы класса:**

* `set items(list: IProduct[]):void` - установить массив Product в защищённое свойство items.
* `get items(): IProduct[]` - получить массив Product из защищенного свойства items.
* `find(string: id): IProduct | undefined` - получить конкретный Product по id.

### 3. Order
    Представляет собой модель для заказа, используется для хранения и обработки данных о заказе.
**Поля класса:**

* `protected _payment: PaymentMethod` - способ оплаты.
* `protected _address: string` - адрес.
* `protected _email: string` - email.
* `protected _phone: string` - номер телефона.
* `protected _total: number` - общая стоимость всех товаров в заказе.
* `protected _items: string[]` - список id товаров в виде строк.

**Конструктор принимает аргументы:**

Конструктор не принимает аргументов.

**Методы класса:**

* `set payment(value: PaymentMethod): void` - устанавливает способ оплаты.
* `set address(value: string): void` - устанавливает адрес.
* `set email(value: string): void` - устанавливает email.
* `set phone(value: string): void` - устанавливает номер телефона.
* `set total(value: number): void` - устанавливает общую стоимость товаров в заказе.
* `set items(list: string[]): void` - устанавливает список товаров заказа в виде массива из id.
* `toAPIObject(): IOrderData` - возвращает объект, пригодный для отправки API post запроса.

### 4. OrderBuilder
    Представляет собой билдер для Order и реализует паттерн "builder". Нужен для поэтапного формирования заказа.
**Поля класса:**

* `protected order: IOrder` - экземпляр класса Order, который позже будет модифицирован методами.

**Конструктор принимает аргументы:**
* `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
* `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

**Методы класса:**
* `set delivery(delivery: IDelivery): void` - установка данных о доставке (адрес, способ оплаты).
* `set contacts(contacts: IContacts): void` - установка контактных данных (телефон, email).
* `set orderList(orderList: IOrderList): void` - установка данных о купленных товарах.
* `get result(): IOrder` - возвращает объект заказа.

### 5. Basket 
    Наследуется от базового класса Model. Представляет собой модель для коллекции товаров в корзине, используется для хранения и обработки данных о товарах в корзине. Хранит список объектов, которые поддерживают интерфейс IProduct. В корзину нельзя добавить 2 или более одинаковых товаров. При добавлении или удалении товаров генерируется событие 'basket:items-changed', после чего BasketCard и BasketView перерисовывают элементы корзины.
**Поля класса:**

* `_items: IProduct[]` - массив объектов - товаров.

**Конструктор принимает аргументы:**

* `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
* `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

**Методы класса:**

* `add(item: IProduct): void` - добавить товар в корзину.
* `remove(id: string): void` - удалить товар из корзины по id.
* `contains(id: string): boolean` - проверить содержится ли товар с данным id в корзине.
* `clear(): void` - очистить корзину.
* `get items(): IProduct[]` - получить массив объектов - товаров из защищенного свойства items.
* `get total(): number` - получить общую стоимость всех товаров в корзине.
* `get length(): number` - получить длинну массива _items.
* `getIdList(): string[]` - получить массив id в виде строк.

## Ключевые типы данных:
    interface IModel {
	    emitChanges(event: string, data?: object): void;
    }
    
    interface IView<T> {
	    toggleClass(element: HTMLElement, className: string, force?: boolean): void;
	    setText(element: HTMLElement, value: unknown): void;
	    setDisabled(element: HTMLElement, state: boolean): void;
	    setHidden(element: HTMLElement): void;
	    setVisible(element: HTMLElement): void;
	    setImage(element: HTMLElement, src: string, alt?: string): void;
	    render(data?: Partial<T>): HTMLElement;
    }

    interface IProduct {
	    id: string;
	    title: string;
	    description: string;
	    category: string;
	    price: number;
	    image: string;
    }

    interface IIdentifier {
	    id: string;
    }

        type ICatalogCard = Omit<IProduct, 'description'>;
        type IPreviewCard = IProduct & { valid: boolean; state: boolean };
        type IBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
	        index: number;
        };
     
        type PaymentMethod = 'cash' | 'card';

        interface IDelivery {
	        payment: PaymentMethod;
	        address: string;
        }

        interface IContacts {
	        email: string;
	        phone: string;
        }
    
        interface IOrderList {
	    total: number;
	    items: string[];
        }
    
    type IOrderData = IDelivery & IContacts &  IOrderList;
    
        interface IOrderBuilder {
	        delivery: IDelivery;
	        contacts: IContacts;
	        orderList: IOrderList;
	        result: IOrderData;
    }
    
        interface IOrderResult {
	    id: string;
	    total: number;
    }
    
    interface IShopApi {
	    getProductList(): Promise<IProduct[]>;
	    getProductItem(id: string): Promise<IProduct>;
	    postOrder(order: IOrderData): Promise<IOrderResult>;
    }
    
    interface IFormState {
	    valid: boolean;
	    error: string;
    }
    
    interface IForm extends IFormState {
	    render(data?: IFormState): HTMLElement;
    }
    
    interface IInputData {
	    field: string;
	    value: string;
    }
    
    export type {
	    IModel,
        IView,
        IShopApi,
        IProduct,
        IIdentifier,
        ICatalogCard,
        IPreviewCard,
        IBasketCard,
        PaymentMethod,
        IOrderData,
        IContacts,
        IOrderResult,
        IOrderList,
        IOrderBuilder,
        IDelivery,
        IFormState,
        IForm,
        IInputData,
    };

----

      Проектная работа находится в стадии разработки и будет доробатываться.