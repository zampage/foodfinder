#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { Place, MenuDay, DateNotValidError, PlaceNotAvailableError } from './models';
import { formatCalendar } from './helper';
import { Shopbar } from './places/shopbar';
import { Coop } from './places/coop';
import { Moment } from 'moment';
import { AxiosError } from 'axios';
const axios = require('axios').default;
const moment = require('moment');

export class Foodfinder {
    public places: Place[] = [new Shopbar(), new Coop()];

    constructor(
        public program: any
    ) {}

    public async render(place: Place): Promise<void> {
        // setup
        place = await this.loadPlace(place);
        let menus: MenuDay[] = place.menu;

        // render title
        this.renderTitle(place);

        // filter dates
        menus = this.filterToday(menus);
        menus = this.filterTomorrow(menus);
        menus = this.filterDate(menus);

        // render days
        menus.forEach((md: MenuDay) => {
            this.renderDay(md.day);
            md.items.forEach(item => this.renderItem(item));
        });
    }

    public filterToday(md: MenuDay[]): MenuDay[] {
        return md.filter((md: MenuDay) => {
            if (!this.program.today) return true;
            return md.day.isSame(moment(), 'day');
        });
    }

    public filterTomorrow(md: MenuDay[]): MenuDay[] {
        return md.filter((md: MenuDay) => {
            if (!this.program.tomorrow) return true;
            return md.day.isSame(moment().add(1, 'day'), 'day');
        });
    }

    public filterDate(md: MenuDay[]): MenuDay[] {
        return md.filter((md: MenuDay) => {
            if (this.program.date === undefined) return true;
            return md.day.isSame(this.program.date, 'day');
        });
    }

    public async loadPlace(place: Place): Promise<Place> {
        return axios.get(place.link)
            .then((response: any) => {
                const dom = new JSDOM(response.data);
                const body = dom.window.document.body;
                place.menu = place.grep(body);
                return place;
            })
            .catch((error: AxiosError | Error) => {
                if ((<AxiosError>error).isAxiosError) {
                    throw new PlaceNotAvailableError(place.title);
                } 
                
                throw error;                
            });
    }

    public renderTitle(place: Place) {
        console.log('------------------------');
        console.log(place.title);
        console.log('------------------------');
    }

    public renderDay(day: Moment) {
        const dayName = formatCalendar(day);
        const dayNum = day.format('DD.MM');
        console.log(`${dayName} ${dayNum}:`);
    }

    public renderItem(item: string) {
        console.log('- ' + item);
    }

    public processPlace(placeStr: string) {
        const places = this.places.filter(place => place.name.indexOf(placeStr) >= 0);
        return places.length > 0 ? places : this.places;
    }

    public processDate(date: string): Moment {
        const allowedFormats: string[] = ['DD', 'DD.MM', 'DD.MM.YYYY', 'MM/DD', 'MM/DD/YYYY'];
        const m = moment(date, allowedFormats, true);

        if (!m.isValid()) {
            throw new DateNotValidError(date);
        }
        
        return m;
    }

    public renderError(error: Error) {
        console.log(`${error.name}: ${error.message}`);
    }
}