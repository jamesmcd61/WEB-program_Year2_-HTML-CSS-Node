/*server create*/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'POE')));
app.get('/', (request, response) =>
response.sendFile(path.join(__dirname,'POE','Home.html')));
app.post('/process', (request, response) => {
 const postBody = request.body;
 console.log(postBody);
 response.sendFile(`{__dirname}/success.html`);
});
app.listen(3030, () => console.info('Application running on port 3030'));

/*connecting to the database*/
var mysql = require('mysql');
var con = mysql.createConnection({
host: "db4free.net",
user: "jamesmcd1",
password: "adm2311021",
database:"webepoe"
});

/*checking and saying if it is connected*/
con.connect(function(err) {
if (err) throw err;
console.log("server Connected!");
var sql = "Use  webepoe";
con.query(sql, function (err, result) {
if (err) throw err;
console.log("Database connected");
});
});
/*upon click, submit data*/
app.post('/submit',(req,res)=>{
	const FirstName = req.body.firstname;
	const LastName = req.body.lastname;
	const Email = req.body.email;
	const ContactNumber = req.body.contactnumber;
	console.log(FirstName,LastName,Email,ContactNumber);

	var sqlin = `INSERT INTO webepoe.POE(FirstName,LastName,Email,ContactNumber) VALUES ('${FirstName}','${LastName}','${Email}','${ContactNumber}')`
	con.query(sqlin, function (err, result) {
	if (err) throw err;
	console.log("Records inserted");
	});
	
	if('/submit'){
		res.redirect('Home.html');
	}
	
	
	/*mailing*/
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	user: 'webepoesenderemail@gmail.com',
	pass: '1234admin'
	}
	});
	/* emails the person from*/
	var mailOptions = {
	from: 'webepoesenderemail@gmail.com',
	to: Email,
	subject: 'Sending Email using Node.js',
	html: '<h1>Welcome</h1><p>Thank you for siging up to our !</p>'
	};
	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
	});
	
	con.end();
});
/*button click action */
app.use('/login',(req,res)=>{

		const UserName = req.body.username;
		const PassWord = req.body.password;

		var sqlUN ="SELECT UserNames,Passwords FROM Login WHERE UserNames = 'admin'"
		var sqlPW ="SELECT Passwords,UserNames FROM Login WHERE Passwords ='admin'"
		

		con.query(sqlPW,sqlUN, function (err, result, fields) {
		if (err) throw err;
		});
	
		if((UserName == 'admin')&&(PassWord == 'admin')){
			
			console.log('Login accepted');
			if('/login'){
			res.redirect('AfterLogin.html');
			}
			
		}else{
			console.log('Not right Login');
		}
});
app.use('/data',(req,res)=>{
	
var sqlview = "SELECT * FROM POE"
con.query(sqlview, function (err, result, fields) {
if (err) throw err;
console.log(result);
});
});