#!/usr/bin/env node

var Phant = require('phant'),
    dotenv = require('dotenv').load(),
    path = require('path'),
    //HttpManager = require('phant-manager-sparkfun'),
    HttpManager = require('phant-manager-http'),
    Keychain = require('phant-keychain-hex'),
    Meta = require('phant-meta-mongodb'),
    Storage = require('phant-stream-mongodb'),
    //JSONstream = require('JSONStream'),
    //MqttIn = require('phant-input-mqtt'),
    //MqttOut = require('phant-output-mqtt'),
    //Throttler = require('phant-throttler-redis'),
    //Mailer = require('phant-notify-email'),
    //redis = require('redis'),
    app = Phant();

//var mailer = Mailer({
//  from: 'data.sparkfun.com <data@sparkfun.com>',
//  subject: 'New data.sparkfun.com Stream: ',
//  host: 'https://data.sparkfun.com'
//});

//mailer.useSendmail();

var keys = Keychain({
  publicSalt: process.env.PHANT_PUBLIC_SALT || 'public salt',
  privateSalt: process.env.PHANT_PRIVATE_SALT || 'private salt',
  deleteSalt: process.env.PHANT_DELETE_SALT || 'delete salt'
});

var mongo = Meta({
  url: process.env.MONGOLAB_URI || 'mongodb://localhost/test'
});

var stream = Storage({
  cap: process.env.PHANT_CAP || 1 * 1024 * 1024, // 1 mb
  url: process.env.MONGOLAB_URI || 'mongodb://localhost/test'
});



var validator = Phant.Validator({
  metadata: mongo
});

var configStream = Phant.ConfigStream({
  validator: validator,
  keychain: keys
});

var httpOutput = Phant.HttpOutput({
  validator: validator,
  storage: stream,
  keychain: keys
});

//var throttler = Throttler({
//  host: process.env.PHANT_REDIS_HOST || 'localhost',
//  port: process.env.PHANT_REDIS_PORT || 6379,
//  limit: 300
//});

var httpInput = Phant.HttpInput({
  //throttler: throttler,
  configStream: configStream,
  validator: validator,
  keychain: keys
});

var httpManager = HttpManager({
  metadata: mongo,
  keychain: keys,
  validator: validator,
  //notifiers: [mailer]
});

// start listening for connections
//Phant.HttpServer.listen(process.env.PHANT_PORT || 8080);
Phant.HttpServer.listen(process.env.PORT || 8080);

// attach input to http server
Phant.HttpServer.use(httpInput);

// attach manager to http server
Phant.HttpServer.use(httpManager);

// register manager with phant
app.registerManager(httpManager);

// attach output to http server
Phant.HttpServer.use(httpOutput);

// register input with phant
app.registerInput(httpInput);

app.registerOutput(stream);
//app.registerOutput(config);
//app.registerOutput(httpOutput);

// mqtt out will use the same config
/*
var mqttIn = MqttIn({
  throttler: throttler,
  validator: validator,
  keychain: keys,
  port: 1883,
  backend: {
    type: 'redis',
    redis: require('redis'),
    port: process.env.PHANT_REDIS_PORT || 6379,
    host: process.env.PHANT_REDIS_HOST || 'localhost',
    return_buffers: true
  }
});

// enable mqtt over websockets
mqttIn.server.attachHttpServer(Phant.HttpServer.server);

app.registerInput(mqttIn);
app.registerOutput(
  MqttOut({
    validator: validator,
    keychain: keys
  })
);
*/
console.log(
  "            .-.._\n      __  \/`" +
  "     '.\n   .-'  `\/   (   a \\" +
  "\n  \/      (    \\,_   \\\n \/|" +
  "       '---` |\\ =|\n` \\    \/_" +
  "_.-\/  \/  | |\n   |  \/ \/ \\ \\" +
  "  \\   \\_\\  jgs\n   |__|_|  |_|" +
  "__\\\n  welcome to phant.\n\n"
);
console.log("PORT IS");
console.log(process.env.PORT);
console.log("PORT IS");
