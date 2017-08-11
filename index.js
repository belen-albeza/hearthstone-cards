const unirest = require('unirest');
const sortBy = require('lodash.sortby');
const toCSV = require('csv-stringify');
const argv = require('minimist')(process.argv.slice(2));

const API_URL = 'https://omgvamp-hearthstone-v1.p.mashape.com';
var config = {};

//
// read input and config
//

try {
    config = require('./config.json');
}
catch (e) {
    console.log('No config file found. Using default options…');
}

if (argv.key) { config.key = argv.key; }
if (argv.set) { config.set = argv.set; }

if (!config.key) {
    console.error('Error. No API key provided. Please provide it in a `config.json` file or with the --key argument.');
    process.exit(1)
}


//
// download set and adjust its ordering / format
//

// queries the api for all the collectibles cards in a given set
function downloadSet(name) {
    return new Promise((resolve, reject) => {
        unirest.get(`${API_URL}/cards/sets/${name}`)
            .header("X-Mashape-Key", config.key)
            .end(function (result) {
                if (result.error) {
                    reject(`Error ${result.error.status}`);
                }
                else {
                    resolve(result.body.filter( x => !!x.collectible ));
                }
            });
    });
}

function sortSet(set) {
    // order by class, then by rarity
    let res = sortBy(set, ['playerClass', 'rarity', 'name']);

    // filter out unwanted properties
    res = res.map((x) => {
        return {
            name: x.name,
            rarity: x.rarity,
            class: x.playerClass === 'Neutral' ? null : x.playerClass,
            available: x.rarity === 'Legendary' ? 1 : 2,
            owned: 0
        };
    });

    // let's put neutral class at the end
    return res.filter(x => x.class !== null)
        .concat(res.filter(x => x.class === null));
}

//
// main
//

downloadSet(config.set)
    .then(function (res) {
        let set = sortSet(res);
        toCSV(set, {header: true}, (err, data) => {
            console.log(data);
        });
    })
    .catch(function (err) {
        console.log(err);
    });
