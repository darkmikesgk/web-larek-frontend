import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		// this._list = ensureElement<HTMLElement>('.basket__list', container);
		// this._total = ensureElement<HTMLSpanElement>('.basket__price', container);
		// this._button = ensureElement<HTMLButtonElement>(
		// 	'.basket__button',
		// 	container
		// );
		// this.events = events;

		// if (this._button) {
		// 	this._button.addEventListener('click', () => {
		// 		events.emit('delivery:isOpen');
		// 	});
		// }
		// this.items = [];

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this.events = events;

		this._button.addEventListener('click', () => this.events.emit('delivery:isOpen'));
		// if (this._button) {
		// 	this._button.addEventListener('click', () => {
		// 		events.emit('delivery:isOpen')
		// 	})
		// }
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }
}
