# glassdoor-extn
[experiment] glassdoor chrome extension

## To Load extension follow https://developer.chrome.com/extensions/getstarted#unpacked
 Load extension folder as an extension from chrome://extensions
 Extension Icon will appear in top right corner of chrome extension bar

## To read page data of a page :
 Click on extension and click on READ button it will read reviews on a page.
 After reading it will send the data to API loacated at https://gdextn.herokuapp.com/ or https://localhost:8080/
 The server will store recent 5 records in a in memory queue.
 The saved data can be explored at https://gdextn.herokuapp.com/ or https://localhost:8080/


## The server show listing of fetched reviews at https://gdextn.herokuapp.com/ or https://localhost:8080/

<h3>The Screens</h3>
![alt tag](https://raw.githubusercontent.com/vijay22uk/glassdoor-extn/master/screens/logo.png)

![alt tag](https://raw.githubusercontent.com/vijay22uk/glassdoor-extn/master/screens/expand.png)

![alt tag](https://raw.githubusercontent.com/vijay22uk/glassdoor-extn/master/screens/explorer.png)

![alt tag](https://raw.githubusercontent.com/vijay22uk/glassdoor-extn/master/screens/compare.png)
