import { Moment } from 'moment';

export interface Place {
    title: string;
    name: string;
    link: string;
    menu: any[];

    grep(body: HTMLElement): MenuDay[];
}

export class MenuDay {
    public day: Moment;
    public items: string[];
}

export class ElementNotFoundError extends Error {
    public name: string = 'ElementNotFoundError';

    constructor(elementName: string) {
        super(`Element "${elementName}" was not found in DOM`);
    }
}

export class DateNotValidError extends Error {
    public name: string = 'DateNotValidError';

    constructor(date: string) {
        super(`Date "${date}" is not valid!`);
    }
}

export class PlaceNotAvailableError extends Error {
    public name: string = 'PlaceNotAvailableError';

    constructor(place:string) {
        super(`Place "${place}" is not available!`)
    }
}