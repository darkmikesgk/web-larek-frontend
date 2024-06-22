import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import {
	IProductCard,
	IProductCardActions,
	ItemProductBasket,
} from '../../types';

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
		this.initElements(container);
		this.initEventListeners(actions);
	}

	private initElements(container: HTMLElement): void {
		this._description = container.querySelector(`.${this.blockName}__text`);
		this._image = ensureElement<HTMLImageElement>(
			`.${this.blockName}__image`,
			container
		);
		this._title = ensureElement<HTMLHeadingElement>(
			`.${this.blockName}__title`,
			container
		);
		this._category = ensureElement<HTMLSpanElement>(
			`.${this.blockName}__category`,
			container
		);
		this._price = ensureElement<HTMLSpanElement>(
			`.${this.blockName}__price`,
			container
		);
		this._button = container.querySelector(`.${this.blockName}__button`);
	}

	private initEventListeners(actions: IProductCardActions): void {
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
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

	protected toggleCategory(value: string): void {
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

	set button(value: string) {
		this.setText(this._button, value);
	}

	setDisabledNonPriceButton(state: boolean) {
		if (this._button) {
			if (state) {
				this._button.setAttribute('disabled', 'disabled');
			} else {
				this._button.removeAttribute('disabled');
			}
		}
	}
}

export class BasketProduct extends Component<ItemProductBasket> {
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _index: HTMLSpanElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		index: number,
		private actions?: IProductCardActions
	) {
		super(container);

		this._title = ensureElement<HTMLHeadingElement>(`.card__title`, container);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._index = ensureElement<HTMLSpanElement>(
			`.basket__item-index`,
			container
		);
		this.index = index;
		this._deleteButton = container.querySelector('.card__button');
		this._deleteButton.addEventListener('click', this.handleDeleteClick);
	}

	handleDeleteClick = (evt: MouseEvent) => {
		evt.preventDefault();
		this.actions.onClick?.(evt);
	};

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
	}

	set index(value: number) {
		this._index.textContent = (value + 1).toString();
	}

	render(data: ItemProductBasket): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
