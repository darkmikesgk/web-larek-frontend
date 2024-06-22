import { IBuyerContacts, IDelivery } from '../types';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class DeliveryForm extends Form<IDelivery> {
	protected _paymentButtons: HTMLDivElement;
	protected _online: HTMLButtonElement;
	protected _uponReceipt: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected events: IEvents;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = ensureElement<HTMLDivElement>(
			'.order__buttons',
			container
		);
		[this._online, this._uponReceipt] = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._paymentButtons.addEventListener(
			'click',
			this.handlePaymentButtonClick
		);
	}

	private handlePaymentButtonClick = (evt: MouseEvent) => {
		const target = evt.target as HTMLButtonElement;
		if (target && target.classList.contains('button_alt')) {
			this.setPaymentMethodClass(target.name);
			this.events.emit('payment:isChanged', { target: target.name });
		}
	};

	setPaymentMethodClass(className: string): void {
		[this._online, this._uponReceipt].forEach((btn) => {
			btn.classList.toggle('button_alt-active', btn.name === className);
		});
	}

	get address() {
		return this.container.address.value;
	}

	set address(value: string) {
		this.container.address.value = value;
	}
}

export class BuyerContactsForm extends Form<IBuyerContacts> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);
	}

	get email(): string {
		return this._emailInput.value;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	get phone() {
		return this._phoneInput.value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}
}
