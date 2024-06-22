import { IOrderSuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<IOrderSuccess> {
	protected _total: HTMLParagraphElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, _total: number, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			container
		);
		this.totalPrice = _total;
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		if (actions.onClick) {
			this._closeButton.addEventListener('click', actions.onClick);
		}
	}

  set totalPrice(value: number) {
    this.setText(this._total, `Списано ${value} синапсов`);
  }
}
