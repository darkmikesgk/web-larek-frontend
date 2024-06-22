import { IOrderSuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Success extends Component<IOrderSuccess> {
	protected _description: HTMLParagraphElement;
	protected _closeButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.events = events;
		this._description = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._closeButton.addEventListener('click', () =>
			this.events.emit('success:isSubmit')
		);
	}

  set totalPrice(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }
}
