//This code is now depreciated, please ignore.
//It is only being kept for the sake of reference

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

fetch("https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ")
.then(res => console.log(res))
