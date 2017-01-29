(function () {
    'use strict';
    var inMemoryData = [];
    var port = process.env.PORT || 8080;
    var express = require('express');
    var fs = require("fs");
    var keyword_extractor = require("keyword-extractor");
    var bodyParser = require("body-parser");
    var options = {
        key: fs.readFileSync('./server/cert/cert.private.pem'),
        cert: fs.readFileSync('./server/cert/cert.public.pem')
    };
    var text = fs.readFileSync("./server/wordstokeep.txt", "utf-8");
    //var toIncludeWord = text.split("\r\n");
    var toIncludeWord = text.split("\n");
console.log(JSON.stringify(toIncludeWord));
    console.log(toIncludeWord.indexOf("digital"))
    var app = express();
    // init HTTP server
    var http;
    if (process.env.MONGODB_URI) {
        http = require('http').Server(app);
    } else {
        http = require('https').Server(options, app);
    }
console.log("Mongo --");
    console.log(process.env.MONGODB_URI);


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
            console.log("Loading for" + query.companyName)
            Reviews.find(query, function (err, reviews) {
                console.log("Load for" + reviews.companyName)
                if (err) {
                    res.status(500).send("error");
                } else {
                    var strpro = [];
                    var strons = [];

                    for (var i = 0; i < reviews.length; i++) {
                        //console.log(reviews[i].pros.length,i);
                        console.log("Load for" + reviews[i].reviewId)
                        strpro = strpro.concat(reviews[i].pros.split(" "))
                        strons = strons.concat(reviews[i].cons.split(" "));
                    }
                    // 
                    var extraction_resultPro = strpro.filter(isIncluded)
                        .reduce(function (map, word) {
                            var word = word.toLowerCase();
                            map[word] = (map[word] || 0) + 20;
                            return map;
                        }, Object.create(null));
                    // var extraction_resultCon = keyword_extractor.extract(strons, {
                    //     language: "english",
                    //     remove_digits: true,
                    //     return_changed_case: true,
                    //     remove_duplicates: false
                    // })
                    var extraction_resultCon = strons.filter(isIncluded)
                        .reduce(function (map, word) {
                            var word = word.toLowerCase();
                            map[word] = (map[word] || 0) + 20;
                            return map;
                        }, Object.create(null));

                    var extraction_resultProArr = Object.keys(extraction_resultPro).map(function (key) { return { text: key, size: extraction_resultPro[key] } });
                    var extraction_resultConArr = Object.keys(extraction_resultCon).map(function (key) { return { text: key, size: extraction_resultCon[key] } });

                    // var extraction_resultPro = extraction_resultPro
                    //     .map(function (d) {
                    //         return { text: d, size: 10 + Math.random() * 90 };
                    //     });

                    // var extraction_resultCon = extraction_resultCon
                    //     .map(function (d) {
                    //         return { text: d, size: 10 + Math.random() * 90 };
                    //     });


                    res.status(200).send({ pros: extraction_resultProArr, cons: extraction_resultConArr });
                }
            });

        })


    function isIncluded(value) {
        return toIncludeWord.indexOf(value.toLowerCase()) >= 0;
    }
    //                                                            var Canvas = require("canvas");

    // var cloud = require("d3-cloud");

    // var words = extraction_resultPro
    //     .map(function(d) {
    //       return {text: d, size: 10 + Math.random() * 90};
    //     });

    // cloud().size([960, 500])
    //     .canvas(function() { return new Canvas(1, 1); })
    //     .words(words)
    //     .padding(5)
    //     .rotate(function() { return ~~(Math.random() * 2) * 90; })
    //     .font("Impact")
    //     .fontSize(function(d) { return d.size; })
    //     .on("end", end)
    //     .start();

    // function end(words) { console.log(JSON.stringify(words)); } 
    //                     res.status(200).send(words);
    //                 }
    //             })


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
        var _company = { name: reviews.companyName, currentRating: reviews.currentRating };
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
