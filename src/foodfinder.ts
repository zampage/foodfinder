#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { Place, MenuDay } from './models';
import { formatCalendar } from './helper';
import { Shopbar } from './places/shopbar';
import { Coop } from './places/coop';
import { Moment } from 'moment';
const axios = require('axios').default;
const moment = require('moment');

export class Foodfinder {
    public places: Place[] = [new Shopbar(), new Coop()];

    constructor(
        public program: any
    ) {}

    public async render(place: Place) {
        place = await this.loadPlace(place);
        this.renderTitle(place);
        this.filterToday(place.menu)
            .forEach((md: MenuDay) => {
                this.renderDay(md.day);
                md.items.forEach(item => this.renderItem(item));
            })
    }

    public filterToday(md: MenuDay[]): MenuDay[] {
        return md.filter((md: MenuDay) => {
            if (this.program.today) {
                return md.day.isSame(moment(), 'day');
            }

            return true;
        });
    }

    public async loadPlace(place: Place): Promise<Place> {
        return axios.get(place.link).then((response: any) => {
            const dom = new JSDOM(response.data);
            const body = dom.window.document.body;
            place.menu = place.grep(body);
            return place;
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
}