var cityInput;
var cityName = $(".cityName");
var searchBtn = $("#searchBtn");
var temperature = $("#temperature");
var humidity = $("#humidity");
var windSpeed = $("#windSpeed");
var uvIndex = $("#uvIndex");
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
    previousSearch.append(`<button class="btn btn-outline-primary" onclick="getInfo('${cityInput}')" id="${cityInput}">${cityInput}</button><br/>`);
    getInfo(`${cityInput}`);

}

function getInfo(cityInput){
    $.ajax({
        url:`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=78dc899eb37cab91867a345825f4223c`,
        method:"GET"
    }).then(addInfo);

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=78dc899eb37cab91867a345825f4223c`,
        method: "GET"
    }).then(forecastInfo);
}

function addInfo(apiResult){
    console.log(apiResult);
    //Current Info
    temperature.empty();
    humidity.empty();
    windSpeed.empty();
    temperature.empty();

    cityName.html(`${apiResult.name} (${date}) ${apiResult.weather[0].icon}`)//city name// wrong
    temperature.append(`<p>Temperature: ${apiResult.main.temp} &#8457;</p>`);
    humidity.append(`<p>Humidity: ${apiResult.main.humidity} %</p>`);
    windSpeed.append(`<p>Wind Speed: ${apiResult.wind.speed} MPH</p>`);
    //uvIndex.append();

}

    //5 Day Forecast
function forecastInfo(apiResult){
    console.log(apiResult);
    var newDates;
    var icon;
    var newTemp;
    var newHumidity;

    for (var i = 1; i <=5; i++){
        newDates = moment().add(i,"days").format("l");
        newTemp = apiResult.list[i].main.temp; 
        newHumidity = apiResult.list[i].main.humidity; 
        icon = apiResult.list[i].main.icon; 

        // $(".weekForecast").append(
        //     `<div class="card">
        //         <h2>Hello</h2>
        //         <h2>Hello</h2>
        //         <h2>Hello</h2>
        //         <h2>Hello</h2>

        //     </div>
             
        //     `
        // )
    }
}

    // for (var i = 1; i <=5; i++){
    //     var newDates = moment().add(i,"days").format("l");
    //     var futureTemp = apiResult.list[i]; 

    // }
    // $(".weekForecast").append(

    // )


    // for (var i=1; i <=5; i++){
    //     var futureDates = moment().add(i, 'days').format('l');
    //     const listFutureDay =apiResult.list[i];
    //     var temper = listFutureDay.main.temp;
    //     const temperature = temper;
    //     const humidity = listFutureDay.main.humidity;
    //     const windSpeed = listFutureDay.wind.speed;
    //     const latitude = apiResult.city.coord.lat;
    //     const longitude = apiResult.city.coord.lon;
    //     $(".futureDays").append(
    //       `
    //       <div id="day${i}" class="card">
    //           <h5>${futureDates}</h5>
    //           <p>Temp: ${temperature}°</p>
    //           <p>Humidity: ${humidity}%</p>
    //       </div>
    //       `
    //     )