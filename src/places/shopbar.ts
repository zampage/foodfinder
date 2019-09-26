import { Place, MenuDay, ElementNotFoundError } from '../models';
import { preventLinebreaks } from '../helper';
const moment = require('moment');

export class Shopbar implements Place {
    public title: string = 'Shopbar';
    public name: string = 'shopbar';
    public link: string = 'http://www.shopbar.ch/menueplan/';
    public menu: MenuDay[];

    public grep(body: HTMLElement): MenuDay[] {
        const sections: Element[] = Array.from(body.querySelectorAll('#content section'));
        return sections.map(section => {
            const md = new MenuDay();
            const daySelector = '.col h3';
            const dayElem = section.querySelector(daySelector);
            const itemSelector = '.col:nth-child(2) h3';
            const itemElems = Array.from(section.querySelectorAll(itemSelector));
        
            if (dayElem) {
                md.day = moment(dayElem.textContent, 'DD.MM.YYYY');
            } else {
                throw new ElementNotFoundError(daySelector);
            }

            if (itemElems.length > 0) {
                md.items = itemElems.map(titleElem => preventLinebreaks(<string>titleElem.textContent));
            } else {
                throw new ElementNotFoundError(itemSelector);
            }
            
            return md;
        });
    }
}