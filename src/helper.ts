import { Moment, CalendarSpec } from "moment";

const calenderFormat_de: CalendarSpec = {
    lastDay : '[Gestern]',
    sameDay : '[Heute]',
    nextDay : '[Morgen]',
    lastWeek : 'dddd',
    nextWeek : 'dddd',
    sameElse : 'L'
};

export const preventLinebreaks = (str: string) => str.replace(/\r?\n|\r/g, ' ');

export const preventBr = (element: Element) => {
    Array.from(element.querySelectorAll('br'))
        .forEach(br => br.replaceWith(' '));
}

export const formatCalendar = (day: Moment) => day.calendar(undefined, calenderFormat_de);