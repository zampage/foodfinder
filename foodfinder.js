const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const moment = require('moment');
const { Shopbar, Coop } = require('./places');
moment.locale('de');

const places = [Shopbar, Coop];
const calendarFormat = {
    lastDay : '[Gestern]',
    sameDay : '[Heute]',
    nextDay : '[Morgen]',
    lastWeek : 'dddd',
    nextWeek : 'dddd',
    sameElse : 'L'
};

const getResults = async() => await Promise.all(places.map(async place => {
    return fetch(place.link)
    .then(result => result.text())
    .then(html => {
        const dom = new JSDOM(html);
        const body = dom.window.document.body;
        const menu = place.grep(body, dom.window.document);
        return {place, menu};
    });
}));

getResults().then(results => {
    results.forEach(({place, menu}) => {
        console.log('------------------------');
        console.log(place.title);
        console.log('------------------------');
        menu.forEach(m => { 
            const day = m.day.format('DD.MM');
            const dayName = m.day.calendar(null, calendarFormat);
            console.log(`${dayName} ${day}:`);
            m.list.forEach(item => console.log('- ' + item));
            console.log();
        });
    });
});