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
    public message: string = 'Element was not found!';

    constructor(elementName: string) {
        super();
        this.message = `Element "${elementName}" was not found in DOM`;
    }
}