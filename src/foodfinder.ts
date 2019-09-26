import { JSDOM } from 'jsdom';
import { MenuDay } from './models';
import { formatCalendar } from './helper';
import { Shopbar } from './places/shopbar';
import { Coop } from './places/coop';
const axios = require('axios').default;
const moment = require('moment');
moment.locale('de');

const places = [new Shopbar(), new Coop()];

const getResults = async() => await Promise.all(places.map(async place => {
    return axios.get(place.link)
        .then((response: any) => {
            const dom = new JSDOM(response.data);
            const body = dom.window.document.body;
            place.menu = place.grep(body);
            return place;
        });
}));

getResults().then(results => {
    results.forEach(place => {
        console.log('------------------------');
        console.log(place.title);
        console.log('------------------------');
        place.menu.forEach((m: MenuDay) => { 
            const day = m.day.format('DD.MM');
            const dayName = formatCalendar(m.day);
            console.log(`${dayName} ${day}:`);
            m.items.forEach(item => console.log('- ' + item));
            console.log();
        });
    });
});