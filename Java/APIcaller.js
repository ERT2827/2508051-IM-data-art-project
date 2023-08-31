var req1 = new XMLHttpRequest();
var url1 = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ";

req1.open("GET", url1 + api_key);
req1.send();

req1.addEventListener("load", function(){
	if(req1.status == 200 && req1.readyState == 4){
  	var response = JSON.parse(req1.responseText);
    document.getElementById("title").textContent = response.title;
    document.getElementById("date").textContent = response.date;
    document.getElementById("pic").src = response.hdurl;
    document.getElementById("explanation").textContent = response.explanation;
  }
})

var req2 = new XMLHttpRequest();
var url2 = "https://sscweb.gsfc.nasa.gov/WS/sscr/2/application.wadl?api_key=";

req2.open("GET", url2 + api_key);
req2.send();

req2.addEventListener("load", function () {
  console.log(req2.status);
})

var req3 = new XMLHttpRequest();
var url3 = "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories/?api_key="

req3.open("GET", url3 + api_key + " Accept: application/json");
req3.send();

req3.addEventListener("load", function () {
  console.log(req3.status);
  if (req3.status == 200 && req3.readyState == 4) {
  	(req3.responseText)
  }
})