var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jwt = require('jsonwebtoken');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req,res, next) {
// 	console.log('....coming here');
// 	next();
// });


app.get('/api', (req, res) => res.status(200).send({data:'HelloWorld!!'}));

app.post('/api/create', verifyToken ,(req,res, next) => {
	jwt.verify(req.token, 'secretKey', (err, userData) => {
		if(err) {
			res.sendStatus(403);
		} else {
			res.json({user: userData});
		}
	});
	
});

app.post('/api/login', (req,res) => {
	const user = {
		id: 1234,
		email:'vijju.nemala@gmail.com',
		password: 'vijju@123'
	};

	jwt.sign({user:user}, 'secretKey', {expiresIn: '30s'},(err, token) => {
		if(err){
			res.sendStatus(403)
		} else {
			res.send({
				token: token
			})
		}
	});
});

function verifyToken(req,res,next) {
	const berearHeaders = req.headers['authorization'];
	if(typeof berearHeaders !== undefined) {
		const berear = berearHeaders.split(' ');
		const berearToken = berear[1];
		req.token = berearToken;
		next();
	} else {
		res.send(403);
	}
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.listen(3000, () => console.log(`Example app listening on port 3000!`))


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
