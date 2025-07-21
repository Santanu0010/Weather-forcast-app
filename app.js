const city = document.getElementById("city");


const searchBtn=document.querySelector("#search-btn");
const locationBtn=document.querySelector("#location-btn");

const currentWeather=document.querySelector("#currentWeather");

//created this function to fetch the details 
async function weatherDataFetch(cityName) {
  try {
    const apiKey = "42324e496719d2f452d722e4fc0e562d";
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    // Extract details
    const citi = data.name;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    
    // Display Current Weather
    currentWeather.innerHTML = `
      <div class="inner-container bg-white rounded-xl shadow-md p-6 mt-6 text-center flex flex-row justify-around">
      
      
        <div class="left-container text-left space-y-2">
          <h2 class="text-2xl font-bold">${citi}</h2>
          <p>Temperature: <span class="text-blue-600 font-semibold">${temp}°C</span></p>
          <p>Wind: <span>${wind} m/s</span></p>
          <p>Humidity: <span>${humidity}%</span></p>
        </div>
        <div class="right-container text-center">
          <img src="${iconUrl}" alt="Weather Icon" class="w-20 h-20 mx-auto">
          <p class="capitalize text-gray-700">${data.weather[0].description}</p>
        </div>
      </div>
    `;

    // Call forecast function
    fetchForecast(citi);
   
  } catch (err) {
    alert("Failed to fetch weather data.");
    console.error(err);
  }
}

//for 5-Day Forcast 
async function fetchForecast(cityName) {
  try {
    // Step 1: Define API key and endpoint
    const apiKey = "42324e496719d2f452d722e4fc0e562d";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Step 2: Fetch the data from the forecast API
    const res = await fetch(url);
    const data = await res.json();

    // Step 3: Filter forecast entries for 12:00 PM each day
    const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    // Step 4: Get the forecast container (you must add <div id="forecast"></div> in HTML)
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = ""; // Clear old forecast results before adding new

    // Step 5: Loop through each day’s forecast
    forecastList.forEach(item => {
      const date = new Date(item.dt_txt).toDateString(); // Convert timestamp to readable date
      const temp = item.main.temp;
      const icon = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      const description = item.weather[0].description;

      // Step 6: Create forecast card for the day and append it
      const card = `
        <div class="bg-white rounded-xl shadow-md p-4 text-center w-48 space-y-2">
          <h3 class="font-semibold text-sm">${date}</h3>
          <img src="${iconUrl}" alt="Weather Icon" class="w-16 h-16 mx-auto">
          <p class="text-blue-600 font-bold">${temp}°C</p>
          <p class="capitalize text-gray-700 text-sm">${description}</p>
        </div>
      `;

      forecastContainer.innerHTML += card;
    });

  } catch (error) {
    console.error("Forecast error:", error);
    alert("Failed to fetch 5-day forecast.");
  }
}

// search city value store 
function prevSearch(cityName){
    let list = JSON.parse(localStorage.getItem("recentCities")) || [];
    list = list.filter(item => typeof item === "string");


 if (!list.includes(cityName)) {
  list.push(cityName);
  localStorage.setItem("recentCities", JSON.stringify(list));
}

  list = list.slice(0, 5);

let dropdownList = document.getElementById("recent-dropdown");//fetched the container
dropdownList.innerHTML="";

 const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  dropdownList.appendChild(defaultOption);

  list.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    dropdownList.appendChild(option);
  });

  if (list.length > 0) {
    dropdownList.classList.remove("hidden");
  }
}
document.getElementById("recent-dropdown").addEventListener("change", function() {
  const selectedCity = this.value;
  weatherDataFetch(selectedCity);
});


searchBtn.addEventListener("click",function(){
    //taken input in a clear format 
    const cityName= city.value.trim();
//if no cityName found give user alert 
if(cityName ===""){
        alert("Enter the location properly please");
}
else{
    weatherDataFetch(cityName);
    prevSearch(cityName);
}
})

locationBtn.addEventListener("click",function(){
         navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "42324e496719d2f452d722e4fc0e562d";
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        const citi = data.name;
        weatherDataFetch(citi);
        prevSearch(citi);
    }
    catch (err) {
        alert("Failed to fetch location data.");
        console.error(err);
       

    }

    },
    () => {
      alert("Please allow location access.");
    }
  );
    
    
});







