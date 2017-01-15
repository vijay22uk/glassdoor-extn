(function () {
    'use strict';
    $(document).ready(initUI);
    $(document).on('click', '.loadbtn', function () {
        var ele = $(this).closest(".panel-row");
        var name = ele.find(".selectme").val();
        getReviews(name, function (data) {
            var keysPro = {}; var keysCons = {};
            for (var i = 0; i < data.length; i++) {
                var props = data[i].pros.split(" ");
                var cons = data[i].cons.split(" ");
                for (var j = 0; j < props.length; j++) {
                    var current = keysPro[props[j]];
                    if (current) {
                        keysPro[props[j]] = current + 1;
                    } else {
                        keysPro[props[j]] = 1;
                    }

                }
                for (var k = 0; k < cons.length; k++) {
                    var current = keysPro[props[j]];
                    if (current) {
                        keysCons[cons[k]] = current + 1;
                    } else {
                        keysCons[cons[k]] = 1;
                    }

                }
            }

            var words1 = [];
            var words2 = [];
            $.each(keysPro, function (key, valueObj) {
                words1.push({text: key, weight:valueObj })
            });
            $.each(keysCons, function (key, valueObj) {
                words2.push({text: key, weight:valueObj })
            });
            ele.find(".reviews-pro").jQCloud(words1);
            ele.find(".reviews-con").jQCloud(words2);
        })

    })


    function initUI() {
        getData();
    }
    function getData() {
        $.ajax({
            url: "/api/company",
            method: "GET",
            success: function (data) {
                renderData(data);
            },
            error: function (err) {
                alert('Unable to get data');
            }
        });
    }
    function getReviews(cm, callback) {
        $.ajax({
            url: "/api/reviews/" + cm,
            method: "GET",
            success: function (data) {
                callback(data);
            },
            error: function (err) {
                alert('Unable to get data');
            }
        });
    }
    function renderData(data) {
        var options = $("#company1");
        $.each(data, function () {
            options.append($("<option />").val(this.name).text(this.name));
        });
        var options2 = $("#company2");
        $.each(data, function () {
            options2.append($("<option />").val(this.name).text(this.name));
        });
    }
})();