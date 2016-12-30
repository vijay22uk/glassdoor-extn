(function () {
  'use strict';
  var totalCalls = 0;
  function getCurrentTabUrl(callback) {
    var queryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
      var tab = tabs[0];
      var url = tab.url;
      callback(url);
    });
  }
  // Events Binding
  document.getElementById('btnRead').addEventListener('click', readPageData);
  // Events
  function readPageData() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id,
        {
          msg: "readPageData",
          origin: tabs[0].url
        },
        function (response) {
          if(response.done){
            document.getElementById('btnRead').innerHTML ="DONE (" + ++totalCalls +")";
          }
        });
    });

  }
})();
