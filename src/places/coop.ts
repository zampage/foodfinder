import { Place, MenuDay, ElementNotFoundError } from '../models';
import { preventBr, preventLinebreaks } from '../helper';
const moment = require('moment');

export class Coop implements Place {
    public title: string = 'Coop';
    public name: string = 'coop';
    public link: string = 'https://www.coop-restaurant.ch/de/menueseite.vst2076.restaurant.html';
    public menu: MenuDay[];

    public grep(body: HTMLElement): MenuDay[] {
        const sections = Array.from(body.querySelectorAll('.row[id*="weekday"]'));
        return sections.map(section => {
            const md = new MenuDay();
            const id = section.getAttribute('id');
            const daySelector = `select#wochentag option[value="${id}"]`;
            const dayElem = body.querySelector(daySelector);
            const listSelector = '.RES-APP-001_menu-item .RES-APP-001_menu-item--ingredients';
            const list = Array.from(section.querySelectorAll(listSelector));

            if (dayElem) {
                const dayStr = (<string>dayElem.textContent).split(',')[1].trim();
                md.day = moment(dayStr, 'DD.MM');
            } else {
                throw new ElementNotFoundError(daySelector);
            }

            if (list.length > 0) {
                md.items = list.map(row => {
                    preventBr(row);
                    return preventLinebreaks((<string>row.textContent).trim());
                });
            } else {
                throw new ElementNotFoundError(listSelector);
            }

            return md;
        });
    }
}