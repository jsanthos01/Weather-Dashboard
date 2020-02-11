var cityInput;
var longitude;
var latitude;
var iconDiv = $(".icon");
var cityName = $(".cityName");
var searchBtn = $("#searchBtn");
var temperature = $("#temperature");
var humidity = $("#humidity");
var windSpeed = $("#windSpeed");
var uvDisplay = $("#uvIndex");
var previousSearch = $("#previousSearch");
var date = moment().format("L");


//Local Storage Stuff
var buttonsArr = localStorage.buttonsArr ? JSON.parse(localStorage.buttonsArr) : [];

if (localStorage.buttonsArr != null) {
    for (var i = 0 ; i < buttonsArr.length; i++){
        previousSearch.append(`<button class="btn btn-outline-primary" onclick="getInfo('${buttonsArr[i]}')" id="${buttonsArr[i]}">${buttonsArr[i]}</button><br/>`);
    }
}

searchBtn.on("click", createBtn);

function createBtn (){
    cityInput = $("#citySearch").val();

    //Checks if input has already been searched. If so, do not search again
    for (var i = 0; i < buttonsArr.length; i++){
        if ( cityInput == buttonsArr[i] ){
            return;
        }
    }

    buttonsArr.push(cityInput);
    localStorage.buttonsArr = JSON.stringify( buttonsArr);
    previousSearch.append(`<button class="btn btn-outline-primary " onclick="getInfo('${cityInput}')" id="${cityInput}">${cityInput}</button><br/>`);
    getInfo(`${cityInput}`);

}

function getInfo(cityInput,){
    //Current Day Information
    $.ajax({
        url:`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=78dc899eb37cab91867a345825f4223c`,
        method:"GET"
    }).then(addInfo);

    //5 Day Forecast Information
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=78dc899eb37cab91867a345825f4223c`,
        method: "GET"
    }).then(forecastInfo);
}

//Current Day Information
function addInfo(apiResult){
    console.log(apiResult)
    var iconcode =apiResult.weather[0].icon;
    var iconURL ="http://openweathermap.org/img/w/" + iconcode + ".png";

    longitude = apiResult.coord.lon
    latitude = apiResult.coord.lat
    console.log(apiResult);
    console.log(longitude);
    console.log(latitude);
    //Current Info
    temperature.empty();
    humidity.empty();
    windSpeed.empty();
    temperature.empty();
    iconDiv.empty();

    cityName.html(`${apiResult.name} (${date})`)//city name// wrong
    temperature.append(`<h4>Temperature: ${apiResult.main.temp} &#8457;</h4>`);
    humidity.append(`<h4>Humidity: ${apiResult.main.humidity} %</h4>`);
    windSpeed.append(`<h4>Wind Speed: ${apiResult.wind.speed} MPH</h4>`);  
    iconDiv.append(`<img src="${iconURL}"/>`);

    getUV(longitude, latitude);
}

function getUV(lon, lat){
    //UV index information 
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?appid=78dc899eb37cab91867a345825f4223c&lat=${lat}&lon=${lon}`,
        method: "GET"
    }).then(addCurrentUV);
}

function addCurrentUV(apiResult){

    var uvIndex = apiResult.value;
    console.log(` CURRENT UV index ${uvIndex}`);
    var background;

    if(uvIndex <= 3){
        //green
        background = "#b9f6ca"
    }else if (uvIndex >= 3 || uvIndex <= 6) {
        //yellow
        background = "#ffee58";
    }
    else if (uvIndex >= 6 || uvIndex <= 8) {
        //orange
        background = "#ff9800";
    }
    else {
        //red
        background = "#bf360c";
    }
    uvDisplay.empty();
    var uvHeader = $("<h4>");

    uvHeader.text(`UV Index: `);
    uvHeader.append(`<span class="uvIndex" style="background-color: ${background};">${uvIndex}</span>`)
    uvDisplay.append(uvHeader);
}

//5 Day Forecast
function forecastInfo(apiResult){
    
    console.log(apiResult);
    var iconImg;
    var iconlink;
    var newDates;
    var newTemp;
    var newHumidity;

    $(".weekForecast").empty();

    for (var i = 1; i <=5; i++){
        newDates = moment().add(i,"days").format("l");
        newTemp = apiResult.list[i].main.temp; 
        newHumidity = apiResult.list[i].main.humidity; 
        iconImg = apiResult.list[i].weather[0].icon;
        iconlink ="http://openweathermap.org/img/w/" + iconImg + ".png";

        $(".weekForecast").append(
            `
                <div class="card" >
                    <h4 class="card-title">${newDates}</h4>
                    <img src="${iconlink}"/>               
                    <p class="card-text"> Temperature: ${newTemp}</p>
                    <p class="card-text"> Humidity: ${newHumidity}</p> 
                </div> 
            `
        )
    }
}

