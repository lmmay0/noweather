var cityList =$("#city-list");
//var cities = [];
const apiKey = 'cb35caf6bb920bfa26606f3c9dd63186';
var cities = JSON.parse(localStorage.getItem("cities"))||[];

function setLastSearch(city) {
  lastSeach = {
      lastCity: city
  }
  localStorage.setItem('lastSearch', JSON.stringify(lastSeach))
}
//Format for day
function FormatDay(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dayOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return dayOutput;
}
function getLatLong(city){

fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    var cityName = data[0].name
    getResponseWeather (cityName);

    console.log(cityName);
    cities.push(cityName);
    console.log(cities);
    localStorage.setItem('cities', JSON.stringify(cities));
    var lat = data[0].lat;
    var lon = data[0].lon;
    getWeather (lat, lon);


    
  })
  .catch(error => console.error(error));
}
function getWeather(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)

  .then(response => response.json())
  .then(data => { 
    console.log(data);
  })
}

// init();

//Function init();
function init(){
  
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
      }
    // Render cities to the DOM
    renderCities();
    console.log(cities);
}

//Function StoreCities()
function storeCities(){
   // Stringify and set "cities" key in localStorage to cities array
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}

//Function renderCities()
function renderCities() {
    // Clear cityList element
    // cityList.text = "";
    // cityList.HTML = "";
    cityList.empty();
    
    // Render a new li for each city
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listC");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      cityList.prepend(li);
    }
    
    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   


  
  function getResponseWeather(cityName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + key; 

    //Clear content of today-weather
    $("#today-weather").empty();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        
      // Create a new table row element
      cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
      $("#today-weather").append(cityTitle);
      var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#today-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#today-weather").append(cityWindSpeed);
    
    
        //Api to get UV index
       
        //Api to get 5-day forecast  
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
            $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function(response5day) { 
            $("#boxes").empty();
            console.log(response5day);
            for(var i=0, j=0; j<=5; i=i+6){
                var read_date = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var FivedayDiv = $("<div>");
                    FivedayDiv.attr("class","col-3 m-2 bg-primary")
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day;
                    var Fivedayh4 = $("<h6>").text(dayOutput);
                    //Set src to the imags
                    var imgtag = $("<img>");
                    var skyconditions = response5day.list[i].weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyconditions==="Clear"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyconditions==="Rain"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var pTemperatureK = response5day.list[i].main.temp;
                    console.log(skyconditions);
                    var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                    var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                    var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(imgtag);
                    FivedayDiv.append(pTemperature);
                    FivedayDiv.append(pHumidity);
                    $("#boxes").append(FivedayDiv);
                    console.log(response5day);
                    j++;
                }
            
        }
      
    });
      

    });
    
  }
var searchButton = $("#pick-city");
searchButton.on("click", function(event) {
    let city = $("#city-input").val().trim();
console.log(city);
getLatLong(city);

});

  //Click function to each Li 
//   $(document).on("click", "#listC", function() {
//     var thisCity = $(this).attr("data-city");
//     getResponseWeather(thisCity);
//   });


    
  
//   const value = localStorage.getItem('key');
//   localStorage.setItem('key', 'value');
//   localStorage.removeItem('key');
//const weatherData = JSON.parse(localStorage.getItem('weatherData'));

    



  




