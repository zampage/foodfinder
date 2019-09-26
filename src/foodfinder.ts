#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { Place, MenuDay } from './models';
import { formatCalendar } from './helper';
import { Shopbar } from './places/shopbar';
import { Coop } from './places/coop';
import { Moment } from 'moment';
const axios = require('axios').default;
const moment = require('moment');
const program = require('commander');
const { description, version } = require('../package.json')
moment.locale('de');


class Foodfinder {
    public static places: Place[] = [new Shopbar(), new Coop()];

    public static async render(place: Place) {
        place = await this.loadPlace(place);
        this.renderTitle(place);
        this.filterToday(place.menu)
            .forEach((md: MenuDay) => {
                this.renderDay(md.day);
                md.items.forEach(item => this.renderItem(item));
            })
    }

    public static filterToday(md: MenuDay[]): MenuDay[] {
        return md.filter((md: MenuDay) => {
            if (program.today) {
                return md.day.isSame(moment(), 'day');
            }

            return true;
        });
    }

    public static async loadPlace(place: Place): Promise<Place> {
        return axios.get(place.link).then((response: any) => {
            const dom = new JSDOM(response.data);
            const body = dom.window.document.body;
            place.menu = place.grep(body);
            return place;
        });
    }

    public static renderTitle(place: Place) {
        console.log('------------------------');
        console.log(place.title);
        console.log('------------------------');
    }

    public static renderDay(day: Moment) {
        const dayName = formatCalendar(day);
        const dayNum = day.format('DD.MM');
        console.log(`${dayName} ${dayNum}:`);
    }

    public static renderItem(item: string) {
        console.log('- ' + item);
    }

    public static processPlace(placeStr: string) {
        const places = Foodfinder.places.filter(place => place.name.indexOf(placeStr) >= 0);
        return places.length > 0 ? places : Foodfinder.places;
    }
}

// setup program
program
    .description(description)
    .version(version, '-v, --version')
    .option(
        '-p, --place [place]',
        'Ort von dem das Menü angezeigt werden soll',
        (value: string) => Foodfinder.processPlace(value),
        Foodfinder.places
    )
    .option(
        '-t, --today',
        'Zeigt nur das heutige Menü an',
    );

// run program
program.parse(process.argv);

// act upon input
program.place.forEach((place: Place) => Foodfinder.render(place));