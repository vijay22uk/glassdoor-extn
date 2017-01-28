(function () {
    'use strict';
    var api = "https://localhost:8080/extension";
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.msg === "readPageData") {
                readPagereviews(request.origin, sendResponse);
            }
        });

    function sendMessage(message) {
        chrome.runtime.sendMessage(message);
    }

    function readPagereviews(url, callback) {
        var productContainer = $("#ReviewsFeed .empReview");


        if (productContainer && productContainer.length > 0) {
            var arr = [];
            var companyName = "None";
            var currentRating = "0";
            for (var i = 0; i < productContainer.length; i++) {
                var review = parseRview(productContainer[i]);
                companyName = review.companyName;
                currentRating = review.currentRating;
                arr.push(review);
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", api);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({ data: arr, companyName: companyName,currentRating: currentRating, readType: "Reviews", origin: url }));
            console.log(arr);
        }
        callback({ done: true });


    }

    function parseRview(ele) {
        var $ele = $(ele);
        var companyName = $("p[data-company]").data("company");
        var reviewId = $ele.attr("id");
        //$(".hreview .summary")
        var title = $ele.find(".summary").text();
        // $(".hreview time").text()
        var time = $ele.find("time").attr("datetime");
        //gdStars  star
        var rating = "TODO :: " + $ele.find(".gdStars .star").length;
        //$(".hreview .authorInfo ").text() + status + location
        var authorInfo = $ele.find(".authorInfo").text();
        // recommends + outlook  $(".hreview .recommends").text()
        var recommends = $ele.find(".recommends").text();


        // pros + cons  .description > p.pros  || p.cons 
        var pros = $ele.find(".description p.pros").text();
        var cons = $ele.find(".description p.cons").text();
        // adviceMgmt 
        var adviceMgmt = $ele.find(".description p.adviceMgmt").text();
        var currentRating = $(".ratingNum").text()

        return {
            companyName: companyName,
            reviewId: reviewId,
            title: title,
            time: time,
            rating: rating,
            authorInfo: authorInfo,
            recommends: recommends,
            pros: pros,
            cons: cons,
            adviceMgmt: adviceMgmt,
            currentRating : currentRating
        }

    }
})();