import { IOrderSuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<IOrderSuccess> {
	protected _total: HTMLParagraphElement;
	protected _closeButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, _total: number, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		if (actions.onClick) {
			this._closeButton.addEventListener('click', actions.onClick);
		}
	}

  set totalPrice(value: number) {
    this.setText(this._total, `Списано ${value} синапсов`);
  }
}
