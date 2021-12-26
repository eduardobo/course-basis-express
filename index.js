require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var fileUpload = require('express-fileupload');
var fs = require('fs');

app.use(fileUpload());
app.use('/Photos', express.static(__dirname + '/Photos'));

var mysql = require('mysql');
const { response } = require('express');
var connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

const PORT = process.env.APP_PORT || 8000;

// cors you can create a white list, that while list is saved on the cors configuration

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 

app.listen(PORT, () => {
    connection.connect(function(error) {
        if(error) {
            throw error;
        }
    });

    console.log('app listening on port ' + PORT);
});

app.get('/', (request, response) => {
    response.send('Hello word');
});

// Deparment section 
app.get('/api/deparment', (request, response) => {
    var query = `SELECT * from deparment`;
    connection.query(query, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }

        response.send(rows);
    });
});

app.post('/api/deparment', (request, response) => {
    var query = `INSERT INTO deparment (deparmentName) value (?)`;

    var values = [
        request.body['deparmentName']
    ];

    connection.query(query ,values, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }
        
        response.json('Added Succesfully');
    });
});

app.put('/api/deparment/:deparmentId', (request, response) => {
    var query = `UPDATE deparment set deparmentName = ? where deparmentId = ?`;

    var values = [
        request.body['deparmentName'],
        request.params.deparmentId
    ];

    connection.query(query ,values, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }
        
        response.json('Updated Succesfully');
    });
});

app.delete('/api/deparment/:deparmentId', (request, response) => {
    var query = `DELETE FROM deparment WHERE deparmentId = ?`;

    var values = [
        request.params.deparmentId
    ];

    connection.query(query ,values, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }
        
        response.json('Deleted Succesfully');
    });
});

// end Deparment section 

// Employee section 
app.get('/api/employee', (request, response) => {
    var query = `SELECT * from employee`;
    connection.query(query, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }

        response.send(rows);
    });
});

app.post('/api/employee', (request, response) => {
    var query = `INSERT INTO employee (employeeName, deparment, dateOfJoining, photoFileName) 
        value (?, ?, ?, ?)`;

    var values = [
        request.body['employeeName'],
        request.body['deparment'],
        request.body['dateOfJoining'],
        request.body['photoFileName']
    ];

    connection.query(query ,values, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }
        
        response.json('Added Succesfully');
    });
});

app.put('/api/employee/:employeeId', (request, response) => {
    var query = `UPDATE employee set employeeName = ? where employeeId = ?`;

    var values = [
        request.body['employeeName'],
        request.params.employeeId
    ];

    connection.query(query ,values, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }
        
        response.json('Updated Succesfully');
    });
});

app.delete('/api/employee/:employeeId', (request, response) => {
    var query = `DELETE FROM employee WHERE employeeId = ?`;

    var values = [
        request.params.employeeId
    ];

    connection.query(query ,values, function(err, rows, fields) {
        if(err) {
            response.send('Failed');
        }
        
        response.json('Deleted Succesfully');
    });
});

// end employee section 


app.post('/api/employee/savephoto', (request, response) => {
    console.log(request);
    fs.writeFile("./Photos/" + request.files.photo.name,
        request.files.photo.data, function(err) {
            if(err){
                return console.log(err);
            }

            response.json(request.files.photo.name)
        });
});