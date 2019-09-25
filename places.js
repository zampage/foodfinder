const moment = require('moment');

const Shopbar = {
    title: 'Shopbar',
    link: 'http://www.shopbar.ch/menueplan/',
    grep: (body) => {
        const sections = [...body.querySelectorAll('#content section')];
        return sections.map(section => {
            const dayStr = section.querySelector('.col h3').textContent;
            const day = moment(dayStr, 'DD.MM.YYYY');
            const list = [...section.querySelectorAll('.col:nth-child(2) h3')].map(title => title.textContent.replace(/\r?\n|\r/g, ' '));
            return {day, list};
        });
    }
}

const Coop = {
    title: 'Coop',
    link: 'https://www.coop-restaurant.ch/de/menueseite.vst2076.restaurant.html',
    grep: (body) => {
        const sections = [...body.querySelectorAll('.row[id*="weekday"]')];
        return sections.map(section => {
            const id = section.getAttribute('id');
            const dayStr = body.querySelector(`select#wochentag option[value="${id}"]`).textContent;
            const day = moment(dayStr.split(',')[1].trim(), 'DD.MM');
            const list = [...section.querySelectorAll('.RES-APP-001_menu-item .RES-APP-001_menu-item--ingredients')]
                .map(row => {
                    [...row.querySelectorAll('br')].forEach(child => child.replaceWith(' '));
                    return row.textContent.trim().replace(/<br>/g, ' ').replace(/\r?\n|\r/g, ' ');
                });
            return {day, list}
        });
    }
}

module.exports = {Shopbar, Coop};