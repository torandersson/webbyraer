/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , rest = require('./routes/rest')
  , companydetail = require('./routes/companydetail')
  , chart = require('./routes/chart')
  , http = require('http')
  , path = require('path');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.index);
app.get('/:pagename', companydetail.index);
app.get('/users', user.list);
app.get('/rest/companies/:id',rest.index);
app.get('/rest/companies',rest.index);
app.get('/chart/bubblechart',chart.bubblechart)

var server = http.createServer(app);
//  , io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//Chrome extension för alla bolag!!
/*
var clients = 0;
io.sockets.on('connection', function (socket) {
  clients++;
  socket.emit('client', { clients: clients });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('disconnect', function () {
    clients--;
    socket.emit('client', { clients: clients });
  });
});*/
