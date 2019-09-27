#!/usr/bin/env node

import { Place } from './models';
import { Foodfinder } from './foodfinder';
import { Moment } from 'moment';
const moment = require('moment');
const program = require('commander');
const { description, version } = require('../package.json')
moment.locale('de');

const foodfinder = new Foodfinder(program);

// setup program
program
    .description(description)
    .version(version, '-v, --version')
    .option(
        '-p, --place [place]',
        'Ort von dem das Menü angezeigt werden soll',
        (value: string) => foodfinder.processPlace(value),
        foodfinder.places
    )
    .option(
        '-t, --today',
        'Zeigt nur das heutige Menü an',
    )
    .option(
        '-m, --tomorrow',
        'Zeigt das Menü von morgen an',
    )
    .option(
        '-d, --date <datum>',
        'Zeigt Menü für bestimmtes Datum an',
        (date: string): Moment => foodfinder.processDate(date),
    );

// parse arguments
program.parse(process.argv);

// render menus upon program input
program.place.forEach((place: Place) => foodfinder.render(place));