import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IPage } from '../../types';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _basket: HTMLElement;
	protected _basketCounter: HTMLSpanElement;
	protected _wrapper: HTMLDivElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery', container);
		this._basket = ensureElement<HTMLElement>('.header__basket', container);
		this._basketCounter = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			container
		);
		this._wrapper = ensureElement<HTMLDivElement>('.page__wrapper', container);

		this._basket.addEventListener('click', this.handleBasketClick);
	}

	private handleBasketClick = () => {
		this.events.emit('basket:isOpen');
	};

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	set locked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}
}
