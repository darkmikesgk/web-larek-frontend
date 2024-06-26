import { IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected events: IEvents;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.container
		);
		this.events = events;
		this.initEventListeners();
	}

	private initEventListeners(): void {
		this.container.addEventListener('input', this.handleInputChange.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	private handleInputChange(evt: Event): void {
		const target = evt.target as HTMLInputElement;
		const field = target.name as keyof T;
		const value = target.value;
		this.onInputChange(field, value);
	}

	private handleSubmit(evt: Event): void {
		evt.preventDefault();
		this.events.emit(`${this.container.name}:isSubmit`);
	}

	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${String(field)}:isChanged`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
