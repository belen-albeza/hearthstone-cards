# hearthstone-cards

Fetches cards from the [Hearthstone API](https://market.mashape.com/omgvamp/hearthstone) and outputs a CSV so you can manage your collection.

## Requirements

You will need a Mashape API key for this to work. Get one by signing up to [Mashape](https://market.mashape.com) and then adding [the Hearthstone API] to your application.

## Usage

```bash
npm install
node index.js --set "Knights of the Frozen Throne" --key="<your mashape key>"
```

To avoid having to provide the key all the time, you can rename `config.json.template` to `config.json` and edit it to add your API key.
