import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketProduct } from '../../types';
//import { IEvents } from '../base/events';

interface IProductCardActions {
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

export class ProductCard extends Component<IProductCard> {
	protected _description?: HTMLParagraphElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLHeadingElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _button?: HTMLButtonElement;

	private categoryItem: Record<string, string> = {
		'софт-скил': '_soft',
		другое: '_other',
		дополнительное: '_additional',
		кнопка: '_button',
		'хард-скилл': '_hard',
	};

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions: IProductCardActions
	) {
		super(container);

		this._description = container.querySelector(`.${blockName}__text`);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._title = ensureElement<HTMLHeadingElement>(
			`.${blockName}__title`,
			container
		);
		this._category = ensureElement<HTMLSpanElement>(
			`.${blockName}__category`,
			container
		);
		this._price = ensureElement<HTMLSpanElement>(
			`.${blockName}__price`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	//проверить
	protected toggleCategory(value: string) {
		if (value in this.categoryItem) {
			const changeClass = this.categoryItem[value];
			this.toggleClass(this._category, changeClass, true);
		}
	}

	get price(): number {
		return Number(this._price.textContent) || 0;
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
	}
}

export class BasketProduct extends Component<IBasketProduct> {
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _index: HTMLSpanElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		//index: number,
		actions: IProductCardActions
	) {
		super(container);

		this._title = ensureElement<HTMLHeadingElement>(
			`.basket__item-index`,
			container
		);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._index = ensureElement<HTMLSpanElement>(
			`.basket__item-index`,
			container
		);
		//this.setText(this._index, index + 1);
		this._deleteButton = container.querySelector('.card__button');
		this._deleteButton.addEventListener('click', (evt: MouseEvent) => {
			evt.preventDefault();
			actions.onClick?.(evt);
			return false;
		});
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	render(data: IBasketProduct): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
