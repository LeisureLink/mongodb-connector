# mongodb-connector

LeisureLink's conventional mongodb connector utility.

It is a very small convention, primarily to establish `server`, `replset`, and `socket` options.

# Requirements
 - node 4.2 and later (requires ES6)

## Example (plain mongodb)

```javascript
let mongodb = require('mongodb');
let connector = require('@leisurelink/mongodb-connector');

let mongoUri = 'mongodb://myuser:TuguYA8d0fs@mongodb.mydomain.com:27017/mydatabase?ssl=true';

// have the connector use the version of mongodb your app uses, this ensures
// it matches companion modules such as mongojs or mongoose.
connector.use(mongodb)
  .connect(mongoUri)
  .then(db => {
    // your queries here!
  });

```

## Example (mongojs)

```javascript
let mongodb = require('mongodb');
let mongojs = require('mongojs');
let connector = require('@leisurelink/mongodb-connector');

let mongoUri = 'mongodb://myuser:G_g5MA_5dfbR@replset01.mydomain.com:27017,replset02.mydomain.com:27017,replset03.mydomain.com:27017/mydatabase?replicaSet=myreplset&ssl=true';

// have the connector use the version of mongodb your app uses, this ensures
// it matches companion modules such as mongojs or mongoose.
connector.use(mongodb)
  .connect(mongoUri)
  .then(driverDb => {

    mongojs(driverDb, ['myCollection'], (err, db) => {
        assert.equal(null, err);

        // proceed with mongojs' db...
      });

  });

```