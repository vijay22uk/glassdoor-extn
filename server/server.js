(function () {
    'use strict';
    var inMemoryData = [];
    var port = process.env.PORT || 8080;
    var express = require('express');
    var fs = require("fs");
    var bodyParser = require("body-parser");
    var options = {
        key: fs.readFileSync('./server/cert/cert.private.pem'),
        cert: fs.readFileSync('./server/cert/cert.public.pem')
    };
    var app = express();
    // init HTTP server
    var http = require('https').Server(options,app);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    require('./database/db.js');
    var Company = require("./models/company.js");
    var Reviews = require("./models/reviews.js");
    app.use(express.static('./server/public'));
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });
    app.get('/data', function (req, res) {

    })
    app.route('/api/company')
        .get(function (req, res) {
           
            Company.find(function (err, company) {
                if (err) {
                    res.status(500).send("error");
                } else {
                    res.status(200).send(company);
                }
            })

        });
    app.route('/api/reviews/:company')
        .get(function (req, res) {
             var query = { 'companyName': req.params.company };
            Reviews.find(query,function (err, reviews) {
                if (err) {
                    res.status(500).send("error");
                } else {
                    res.status(200).send(reviews);
                }
            })

        });
    app.post('/extension', function (req, res) {
        //inMemoryData.length > 5 && inMemoryData.shift();
        //inMemoryData.push(req.body);
        saveData(req.body, res);
    })
    http.listen(port, function () {
        console.log('Running on port %s!', port)
    })

    // functions
    function saveData(reviews, res) {
        var _company = { name: reviews.companyName };
        var query = { 'name': _company.name };
        Company.findOneAndUpdate(query, _company, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
        });
        saveReviews(reviews.data);
    }
    function saveReviews(rvs) {
        rvs.forEach(function (n) {
            Reviews.findOneAndUpdate({ reviewId: n.reviewId }, n, { upsert: true }, function (err, doc) {
                console.log(doc);
            });
        });
    }
})();
