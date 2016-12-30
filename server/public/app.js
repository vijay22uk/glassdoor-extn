(function () {
    'use strict';
    $(document).ready(initUI);
    function initUI() {
        getData();
    }
    function getData() {
        $.ajax({
            url: "/data",
            method: "GET",
            success: function (data) {
                renderData(data);
            },
            error: function (err) {
                alert('Unable to get data');
            }
        });
    }
    function renderData(data) {
        $("#logs").empty();
        for (var i = 0; i < data.length; i++) {
            var eleConatiner = $('<div class="container"></div>');
            var btn = $('<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#data' + i + ' "+>' + data[i].origin + '</button>')
            eleConatiner.append(btn);
            var text = $('<div id="data' + i + '" class="collapse"></div>');
            for(var j= 0;j<data[i].data.length;j++){
                var review = $('<pre><code>' +JSON.stringify( data[i].data[j], null, 4)+ '</code></pre>');
                text.append(review)
            }
            eleConatiner.append(text);
            $("#logs").append(eleConatiner)
        }



    }
})();