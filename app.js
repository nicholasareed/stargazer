//HTTP server framework
var express = require('express');
//Websockets library
var sio = require('socket.io');

//Initiate web server
var app = express();
//Used to save the last image uploaded
var lastUpload = "";

//Add additional HTTP headers to allow other web servers to use snapshots
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Include static HTML in the 'html' directory
app.use(express.static(__dirname, 'html'));

//Listen on port 4001
var server = app.listen(4001);
server.listen(4001, function() {
    console.log('Server listening at http://localhost:4001/');
});








// var passport = require('passport');
// var Strategy = require('passport-twitter').Strategy;


// // Configure the Twitter strategy for use by Passport.
// //
// // OAuth 1.0-based strategies require a `verify` function which receives the
// // credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// // user's behalf, along with the user's profile.  The function must invoke `cb`
// // with a user object, which will be set at `req.user` in route handlers after
// // authentication.
// passport.use(new Strategy({
//     consumerKey: process.env.CONSUMER_KEY || '773WMWYkbNvd4qROx9sGXu8jg',
//     consumerSecret: process.env.CONSUMER_SECRET || 'K2TIq5qGSW4Yiv0OAqhHgDj6mIY56mclG4FNZBD8t33aRBR6mT',
//     callbackURL: 'http://127.0.0.1:3000/login/twitter/return'
//   },
//   function(token, tokenSecret, profile, cb) {
//     // In this example, the user's Twitter profile is supplied as the user
//     // record.  In a production-quality application, the Twitter profile should
//     // be associated with a user record in the application's database, which
//     // allows for account linking and authentication with other identity
//     // providers.
//     return cb(null, profile);
//   }));


// // Configure Passport authenticated session persistence.
// //
// // In order to restore authentication state across HTTP requests, Passport needs
// // to serialize users into and deserialize users out of the session.  In a
// // production-quality application, this would typically be as simple as
// // supplying the user ID when serializing, and querying the user record by ID
// // from the database when deserializing.  However, due to the fact that this
// // example does not have a database, the complete Twitter profile is serialized
// // and deserialized.
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });


var isLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// // Create a new Express application.
// var app = express();

// // Configure view engine to render EJS templates.
// // app.set('views', __dirname + '/views');
// // app.set('view engine', 'ejs');
// var exphbs  = require('express-handlebars');
// app.set('views', __dirname + '/views');
// app.engine('hbs', exphbs({
//   defaultLayout: 'main',
//   extname: '.hbs'
// }));
// app.set('view engine', 'hbs');

// app.use(express.static('public'));

// // Use application-level middleware for common functionality, including
// // logging, parsing, and session handling.
// app.use(require('morgan')('combined'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// // Initialize Passport and restore authentication state, if any, from the
// // session.
// app.use(passport.initialize());
// app.use(passport.session());



// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/stb1',
  function(req, res){
    res.render('stb',{layout:'stb'});
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

// app.get('/login/twitter',
//   passport.authenticate('twitter'));

// app.get('/login/twitter/return', 
//   passport.authenticate('twitter', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.get('/profile',
  isLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });


app.get('/macs',
  function(req, res){
    res.json({
        info: macInfo,
        macs: macs // connection info
    });
  });









var request = require('request')


// Attach the socket.io server
var io = sio.listen(server);

var mac1 = '70:76:30:6A:AE:C5';
var mac1ip = '10.10.60.205';
var mac2 = 'B4:F2:E8:FD:73:92';
var mac2ip = '10.10.61.51';

var macInfo = {

    // 1
    '70:76:30:6A:AE:C5' : {
        mac: '70:76:30:6A:AE:C5',
        connected: false,
        broadcasting: false,
        ip: '10.10.60.205',
        name: 'Nick',
        channel: 0
    },

    // 2
    'B4:F2:E8:FD:73:92' : {
        mac: 'B4:F2:E8:FD:73:92',
        connected: false,
        broadcasting: false,
        ip: '10.10.61.51',
        name: 'Zane',
        channel: 0
    }

};
var macIds = {
    1: '70:76:30:6A:AE:C5',
    2: 'B4:F2:E8:FD:73:92'
}

var localIp = '10.10.60.148',
    localPort = '4001',
    localUrl = '/html/stb.html';

Object.keys(macInfo).forEach(function(mac){
    request({ 
            method: 'GET', 
            uri: 'http://' + macInfo[mac].ip + ':8080/itv/stopITV'
        }
        , function (error, response, body) {
            console.log('Response');
            if(response && response.statusCode == 200){
                console.log('Stop on Launch');
                console.log(body);
            }

            setTimeout(function(){

                request({ 
                        method: 'GET', 
                        uri: 'http://' + macInfo[mac].ip + ':8080/itv/startURL?url=http://'+localIp + ':' + localPort + localUrl
                    }
                    , function (error, response, body) {
                        if(response.statusCode == 200){
                            console.log('Relaunch responded OK');
                        } else {
                            console.log('Failed Relaunch response status code');
                        }
                    }
                );

            },2000);
        }
    );
});

var macs = {},
    macControl = macIds[1];

console.log('macControl:',macControl);

// Define the message handler
io.on('connection', function(socket) {

    console.log('Client connected');
    var mac = '';
    var macChannel;

    function retryLaunch(){

        console.log('retrying launch');

        var stbIp = mac == mac1 ? mac1ip:mac2ip,
            localIp = '10.10.60.148';

        request({ 
                method: 'GET', 
                uri: 'http://' + stbIp + ':8080/itv/stopITV'
            }
            , function (error, response, body) {
                console.log('Response');
              if(response.statusCode == 200){
                console.log('EXIT BODY');
                console.log(body);

                // relaunch
                console.log('Relaunching in 2 seconds');
                setTimeout(function(){
                    relaunch();
                },2000);
              } else {
                console.log('Failed');
                setTimeout(retryLaunch, 1000);
              }
            }
        );
    }

    function relaunch(){

        var stbIp = mac == mac1 ? mac1ip:mac2ip;


        request({ 
                method: 'GET', 
                uri: 'http://' + stbIp + ':8080/itv/startURL?url=http://'+localIp + ':' + localPort + localUrl
            }
            , function (error, response, body) {
                console.log('Response');
              if(response.statusCode == 200){
                console.log('RELAUNCHED!');
                
                setTimeout(function(){
                    // connected?
                    if(macs[mac]){
                        console.log('DID reconnect!');
                        
                    } else {
                        console.log('NOT reconnected');
                        retryLaunch();
                    }
                },5000);

              } else {
                console.log('FAILED RELAUNCHED!');
              }
            }
        );


    }

    setInterval(function(){
        // mac expired?
        var pastNow = false;
        var timePass = (new Date().getTime()) - (5 * 1000);
        if(macs[mac] && macs[mac] < timePass){
            console.log('Not seen in awhile!');
            macs[mac] = 0;
            retryLaunch();
        }
        // console.log(macs);
    },1000);

    socket.on('mac', function(data){
        console.log('Got mac:', data.mac);
        mac = data.mac;
        macs[data.mac] = new Date().getTime();

        if(!macControl){
            macControl = mac;
        }

        if(macControl == mac){ // && data.channel != macChannel){
            // broadcast out the channel we're on
            macChannel = data.channel;
            console.log('CHANGING CHANNEL',data.channel);
            socket.broadcast.emit('channel',data.channel);
        }

    });

    socket.on('disconnect', function(){
        console.log('Client disconnected');

        macs[mac] = 0;

        // Trying to restart by injecting into them!
        var userChangedChannels = true; // set beforehand
        if(userChangedChannels){

        }

        retryLaunch();

    });

    // console.log('emitted');

    // //A webcam message includes the latest image from capture.html
    // socket.on('webcam', function(data) {
    //     //Create a buffer to save the latest Image
    //     //Not currently used, but useful for debugging
    //     var buffer = new Buffer(data.slice(23), 'base64');
    //     lastUpload = buffer;
    //     console.log("Got new snapshot");
    //     //Send a message back to capture.html that we're ready for next snapshot
    //     socket.emit('sendNextImage', {
    //         "message": "ready"
    //     });
    //     //Broadcast the latest snapshot to playback.html
    //     socket.broadcast.emit('image', {
    //         "image": data
    //     });
    // });
});
