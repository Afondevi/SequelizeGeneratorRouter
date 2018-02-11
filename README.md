# Sequelize Router Generator CLI
A simple generator for Sequelize router with nodejs, so you need to use sequelize in nodejs to use this plugin.

You must to have a `./models` folder with your sequelize models inside.
generate by :

```
sequelize model:create --name NAME_OF_SCRIPT --attributes "..."
```


## Installation

```
npm i sr-generator-cli -g
```

## How use it

before use, create a `/router` folder with index.js and add this inside :
```javascript
'use strict';

const routes = [];

// Add access to the app and db objects to each route
module.exports = function router(app, db) {
  return routes.forEach((route) => {
    route(app, db);
  });
};
```

After, in your express server.js file, add :

```
const router = require('./router/index');

router(app, db);
```

run
``` 
sequelize generate router
```

and select the file name to generate.

## Example

For example, we will create an API to save phone numbers.
Run : 

```
sequelize model:create --name Phones --attributes "
phoneNumber:float,
validated:boolean
"
```

You will get a model file `./models/phones.js` and a migration file `./migrations/XXXXXXXXX-create-phones.js.
Your model look like this :

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  let Phones = sequelize.define('Phones', {
    phoneNumber: DataTypes.FLOAT,
    validated: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Phones;
};
```

The sr-generator-cli use the model file to generate the routes of this file.
when your model is generate, you can use the sr-generator-cli.

Run :
```
sequelize generate router
``` 

Select the file name to generate, and it's finish.
You get a router file named `./router/phones.js whos look like this :

```javascript
'use strict';

module.exports = (app, db) => {

  // GET all phones
  app.get('/phones', (req, res) => {
    db.Phones.findAll()
    .then(phones => {
      res.json(phones);
    });
  });

  // GET one phone by id
  app.get('/phones/:id', (req, res) => {
    db.Phones.find({
      where: { id: req.params.id }
    })
    .then(phone => {
      res.json(phone);
    });
  });

  // POST single phone
  app.post('/phones', (req, res) => {
    db.Phones.create({
      user_id: req.body.user_id,
      phoneNumber: req.body.phoneNumber,
      validated: req.body.validated
    })
    .then(newPhone => {
      res.json(newPhone);
    })
  });

  // PATCH single phone
  app.patch('/phones/:id', (req, res) => {
    db.Phones.find({
      where: { id: req.params.id }
    })
    .then(phones => {
      return phones.updateAttributes(req.body.updates)
    })
    .then(updatedPhone => {
      res.json(updatedPhone);
    });
  });

  // DELETE single phone
  app.delete('/phones/:id', (req, res) => {
    db.Phones.destroy({
      where: { id: req.params.id }
    })
    .then(deletedPhone => {
      res.json(deletedPhone);
    });
  });
};
```

And the route is add in `/router/index.js`

After that, you can test/use your route with Postman (for example) 

## Contributors

If you want to optimise it, tell me :)

## License

MIT
