import './scss/styles.scss';
import { AppState } from './components/AppData';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { BuyerContactsForm, DeliveryForm } from './components/OrderForms';
import { ChangeInCatalogEvent } from './components/AppData';
import { BasketProduct, ProductCard } from './components/common/ProductCard';
import { IBuyerContacts, IDelivery } from './types';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log('EVENT LOGGER', eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const BuyerContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

const deliveryForm = new DeliveryForm(cloneTemplate(deliveryTemplate), events);
const buyerContactForm = new BuyerContactsForm(
	cloneTemplate(BuyerContactsTemplate),
	events
);

//Изменения в элементах каталога
events.on<ChangeInCatalogEvent>('catalog:isChanged', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new ProductCard('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:isChanged', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
	page.basketCounter = appData.getOrderedProducts().length;
});

//Изменения в состоянии валидации формы доставки
events.on('formDeliveryErrors:isChanged', (errors: Partial<IDelivery>) => {
	const { payment, address } = errors;
	deliveryForm.valid = !payment && !address;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//Открытие формы доставки
events.on('delivery:isOpen', () => {
	appData.setPaymentMethod('');
	deliveryForm.setPaymentMethod('');
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
events.on('formBuyerContactsErrors:isChanged', (errors: Partial<IBuyerContacts>) => {
	const { email, phone } = errors;
	buyerContactForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
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

//открыть форму контактов
events.on('contacts:isOpen', () => {
	modal.render({
		content: buyerContactForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//отправка формы заказа
events.on('contact:submit', () => {
	appData.orderSuccess();

	api.orderProduct(appData.order)
	.then((res) => {
		const success = new Success(
			cloneTemplate(successTemplate),
			appData.order.total,
			{
				onClick: () => {
					modal.close();
					appData.clearBasket();
					deliveryForm.setPaymentMethod('');
					events.emit('basket:isChanged');
				},
			}
		);
		modal.render({
			content: success.render({}),
		});
	})
	.catch((err) => {
		console.error(err);
	});
});

//открыть корзину
events.on('basket:isOpen', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

//изменения в корзине
events.on('basket:isChanged', () => {
	page.basketCounter = appData.getOrderedProducts().length;

	let total = 0;
	basket.items = appData.getOrderedProducts().map((item, index) => {
		const card = new BasketProduct(cloneTemplate(cardBasketTemplate), index, {
			onClick: (evt) => {
				appData.deleteProduct(item.id);
				basket.total = appData.getTotal();
			},
		});
		total += item.price;
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = total;
});

events.on('product:isAdded', (item: ProductCard) => {
	appData.addProduct(item);
	modal.close();
});

//Изменение в превью товара
events.on('preview:isChanged', (item: ProductCard) => {
	if (item) {
		api
			.getProductItem(item.id)
			.then((res) => {
				item.id = res.id;
				item.category = res.category;
				item.title = res.title;
				item.description = res.description;
				item.image = res.image;
				item.price = res.price;

				const card = new ProductCard(
					'card',
					cloneTemplate(cardPreviewTemplate),
					{
						onClick: () => {
							if (appData.orderStatus(item)) {
								appData.deleteProduct(item.id);
								modal.close();
							} else {
								events.emit('product:isAdded', item);
							}
						},
					}
				);
				const buttonText: string = appData.orderStatus(item)
					? 'Убрать'
					: 'Купить';

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

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
