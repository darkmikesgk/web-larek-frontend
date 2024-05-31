import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected events: IEvents;

  constructor(conteiner: HTMLElement, protected evt: IEvents) {
    super(conteiner);

    this.events = evt;
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', conteiner);
    this._content = ensureElement<HTMLElement>('.modal__content', conteiner);

    this.container.addEventListener('click', (evt: MouseEvent) => {
        const target = evt.target as HTMLElement;
        if (target.classList.contains('modal')) {
          this.close();
        }
    });
    this._closeButton.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (evt) => evt.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:isOpen');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:isClosed');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}