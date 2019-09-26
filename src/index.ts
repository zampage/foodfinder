#!/usr/bin/env node

import { Place } from './models';
import { Foodfinder } from './foodfinder';
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
    );

// run program
program.parse(process.argv);

// act upon input
program.place.forEach((place: Place) => foodfinder.render(place));