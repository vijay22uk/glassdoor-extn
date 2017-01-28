(function () {
    'use strict';
    $(document).ready(initUI);
    $(document).on('click', '.loadbtn', function () {
        var ele = $(this).closest(".panel-row");
        var name = ele.find(".selectme").val();
        getReviews(name, function (data) {
            ele.find(".reviews-pro").empty();
            ele.find(".reviews-con").empty();
            ele.find(".cloud").removeClass("hidden");
            var ratingPer = Number(ele.find(":selected").data("rating"));
            if (isNaN(ratingPer)) {
                ele.find(".star-ratings-css").addClass("hidden");
            } else {
                ele.find(".star-ratings-css").removeClass("hidden");
                ele.find(".star-ratings-css-top").width((ratingPer / 5)*100 + "%");
            }

            generateCloud(data.pros, ele.find(".reviews-pro").attr("id"));
            generateCloud(data.cons, ele.find(".reviews-con").attr("id"));

        })

    })


    function generateCloud(words, seletor) {
             var words = words
        //  .map(function(d) {
        //    return {text: d, size: 10 + Math.random() * 90};
        //  });
        var fill = d3.scale.category20();
        d3.layout.cloud().size([300, 300]).words(
            words
        )
            .rotate(function () {
                return ~~(Math.random() * 2) * 90;
            })
            .font("Impact")
            .fontSize(function (d) {
                return d.size;
            })

            .on("end", end)
            .start();

        function end(words) {
            d3.select("#" + seletor).append("svg")
                .attr("width", 300)
                .attr("height", 300)
                .append("g")
                .attr("transform", "translate(150,150)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("fill", function (d, i) {
                    return fill(i);
                })
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("font-family", "Impact")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                });
        }
    }


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
            options.append($("<option />").val(this.name).text(this.name).data("rating", this.currentRating));
        });
        var options2 = $("#company2");
        $.each(data, function () {
            options2.append($("<option />").val(this.name).text(this.name).data("rating", this.currentRating));
        });
    }
})();