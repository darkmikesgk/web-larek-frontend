import { IEvents } from './events';

//Проверка объекта на экземпляр класса Model
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};

//Определяет общую структуру и поведение моделей в приложении
export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	//Уведомление об изменении в модели
	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
