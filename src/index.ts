import './scss/styles.scss';
import { AppState } from './components/AppData';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/common/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import {
	BuyerContactsForm,
	DeliveryForm,
} from './components/common/OrderForms';
import { CatalogChangesEvents } from './components/AppData';
import { BasketProduct, ProductCard } from './components/common/ProductCard';
import { FormErrors, IBuyerContacts, IProductItem } from './types';
import { Success } from './components/common/Success';

//Модели приложения
const events = new EventEmitter();
const appData = new AppState({}, events);
const api = new WebLarekApi(CDN_URL, API_URL);

//Мониторим все события, для отладки	
events.onAll(({ eventName, data }) => {
	console.log('EVENT LOGGER', eventName, data);
});

//Темплейты
const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
};

//Контейнеры отображения
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(templates.basket), events);
const deliveryForm = new DeliveryForm(cloneTemplate(templates.order), events);
const buyerContactsForm = new BuyerContactsForm(
	cloneTemplate(templates.contacts),
	events
);

//Функция для создания карточки продукта
const createProductCard = (item: IProductItem) => {
	const card = new ProductCard('card', cloneTemplate(templates.cardCatalog), {
		onClick: () => events.emit('preview:isChanged', item),
	});
	return card.render({
		category: item.category,
		title: item.title,
		image: item.image,
		price: item.price,
	});
};

//Событие в каталоге
events.on<CatalogChangesEvents>('catalog:isChanged', () => {
	page.catalog = appData.catalog.map(createProductCard);
	page.basketCounter = appData.getOrderedProducts().length;
});

//Событие в превью товара
events.on('preview:isChanged', (item: ProductCard) => {
	if (item) {
		api
			.getProductItem(item.id)
			.then((res) => {
				Object.assign(item, {
					id: res.id,
					category: res.category,
					title: res.title,
					description: res.description,
					image: res.image,
					price: res.price,
				});

				const card = new ProductCard(
					'card',
					cloneTemplate(templates.cardPreview),
					{
						onClick: () => {
							if (item.price) {
								if (appData.orderStatus(item)) {
									appData.deleteProduct(item.id);
									modal.close();
								} else {
									events.emit('product:isAdded', item);
								}
							}
						},
					}
				);
				const buttonText = item.price
					? appData.orderStatus(item)
						? 'Убрать'
						: 'В корзину'
					: 'Бесценно';
				card.setDisabledNonPriceButton(!item.price);

				modal.render({
					content: card.render({
						category: item.category,
						title: item.title,
						description: item.description,
						image: item.image,
						price: item.price,
						button: buttonText,
					}),
				});
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

//блокировка прокрутки страницы при открытом модальном окне
events.on('modal:isOpen', () => {
	page.locked = true;
});

//разблокировка прокрутки страницы при закрытии моадльного окна
events.on('modal:isClosed', () => {
	page.locked = false;
});

//Обработчик открытия корзины
events.on('basket:isOpen', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

//Функция создания карточки продукта в корзине
const createBasketProductCard = (item: IProductItem, index: number) => {
	const card = new BasketProduct(cloneTemplate(templates.cardBasket), index, {
		onClick: () => {
			appData.deleteProduct(item.id);
			basket.total = appData.getTotal();
		},
	});
	return card.render({
		title: item.title,
		price: item.price,
	});
};

//Обработчик изменения корзины
events.on('basket:isChanged', () => {
	page.basketCounter = appData.getOrderedProducts().length;
	basket.items = appData.getOrderedProducts().map(createBasketProductCard);
	basket.total = appData
		.getOrderedProducts()
		.reduce((total, item) => total + item.price, 0);
});

//Обработчик добавления товара в корзину
events.on('product:isAdded', (item: ProductCard) => {
	appData.addProduct(item);
	modal.close();
});

//Изменения в состоянии валидации формы доставки
events.on('formDeliveryErrors:isChanged', (errors: FormErrors) => {
	const { payment, address } = errors;
	deliveryForm.valid = !payment && !address;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//Открытие формы доставки
events.on('delivery:isOpen', () => {
	appData.setPaymentMethod('');
	deliveryForm.setPaymentMethodClass('');
	modal.render({
		content: deliveryForm.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//выбор оплаты
events.on('payment:isChanged', (data: { target: string }) => {
	appData.setPaymentMethod(data.target);
});

//Отправка формы заказа
events.on('order:isSubmit', () => {
	events.emit('contacts:isOpen');
});

//Изменения в состоянии валидации формы контактов
events.on('formBuyerContactsErrors:isChanged', (errors: FormErrors) => {
	const { email, phone } = errors;
	buyerContactsForm.valid = !email && !phone;
	buyerContactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//открыть форму контактов
events.on('contacts:isOpen', () => {
	modal.render({
		content: buyerContactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//изменился адрес доставки
events.on('order.address:isChanged', (data: { value: string }) => {
	appData.setAddress(data.value);
});

//изменения в поле контактов
events.on(
	/^contacts\..*:isChanged/,
	(data: { field: keyof IBuyerContacts; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

//отправка формы заказа
events.on('contacts:isSubmit', () => {
	appData.orderSuccess();

	api
		.orderProduct(appData.order)
		.then(() => {
			const success = new Success(
				cloneTemplate(templates.success),
				appData.order.total,
				{
					onClick: () => {
						modal.close();
						appData.clearBasket();
						deliveryForm.setPaymentMethodClass('');
						events.emit('basket:isChanged');
					},
				}
			);
			modal.render({
				content: success.render({}),
			});
			appData.clearBasket();
			deliveryForm.setPaymentMethodClass('');
		})
		.catch((err) => {
			console.error(err);
		});
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
