import { IOrderSuccess, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Success extends Component<IOrderSuccess> {
	protected _total: HTMLParagraphElement;
	protected _closeButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		_total: number,
		private actions: ISuccessActions
	) {
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
		this._closeButton.addEventListener('click', this.handleCloseClick);
	}

	private handleCloseClick = () => this.actions.onClick?.();

	set totalPrice(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
