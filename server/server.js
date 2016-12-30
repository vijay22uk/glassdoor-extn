(function () {
    'use strict';
    var inMemoryData = [];
    var port = process.env.PORT || 8080;
    var express = require('express');
    var bodyParser = require("body-parser");
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('./server/public'));
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });
    app.get('/data', function (req, res) {
        res.send(inMemoryData)
    })
    app.post('/extension', function (req, res) {
        inMemoryData.length > 5 && inMemoryData.shift();
        inMemoryData.push(req.body);
        res.send('done')
    })
    app.listen(port, function () {
        console.log('Example app listening on port %s!', port)
    })

})();
