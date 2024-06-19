import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _basket: HTMLElement;
	protected _basketCounter: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.catalog__items');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:isOpen');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('.page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('.page__wrapper_locked');
		}
	}
}
