//display of current time
let display = document.querySelector(".city");
let p = document.createElement("p");
display.appendChild(p);

let date = new Date();
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[date.getDay()];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let month = months[date.getMonth()];

p.innerHTML = `${day}, ${date.getDate()} ${month} ${date.getFullYear()}<br>${date.toLocaleTimeString()}`;

//main city display
function displayCity(event) {
  event.preventDefault();
  let citySearch = document.querySelector(".search-bar");
  const city = { name: citySearch.value };
  citySearch.value = "";

  setCity(city);
}

function setCity(city) {
  const apiKey = "3fceae23dde22994db28dbf0244f6a96";
  let apiUrl;
  if ("id" in city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${apiKey}`;
  } else {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${apiKey}`;
  }

  axios.get(apiUrl).then(handleCityTemperature);
}

function handleCityTemperature(response) {
  let cityElement = document.querySelector("h1");
  cityElement.innerHTML = response.data.name;

  let cityTemperature = response.data.main.temp;
  currentTemperature = Math.round(cityTemperature);
  temperatureChange();
}

let submitSearch = document.querySelector("button");
submitSearch.addEventListener("click", displayCity);

//favourites
function createButton(city) {
  let favouriteCity = document.createElement("span");
  favouriteCity.setAttribute("class", "favourite");
  favouriteCity.innerHTML = `<i class="fas fa-star"></i> ${city.name}`;
  favouriteCity.addEventListener("click", function() {
    setCity(city);
  });
  return favouriteCity;
}

let favouriteCities = [
  {
    id: 2268339,
    name: "Faro"
  },
  {
    id: 2267057,
    name: "Lisbon"
  },
  {
    id: 2643743,
    name: "London"
  }
];

function setFavourites(cities) {
  let navigation = document.querySelector(".nav");
  // Remove previous favourites if they exist.
  while (navigation.children.length > 1) {
    navigation.removeChild(navigation.children[0]);
  }
  // Add favourites.
  cities.forEach(function(city) {
    let favouriteCity = createButton(city);
    navigation.prepend(favouriteCity);
  });
}

setFavourites(favouriteCities);

//current position
let currentTemperatureElement = document.querySelector("h2");

let span = document.createElement("span");
span.setAttribute("class", "temp");
currentTemperatureElement.appendChild(span);

let button = document.createElement("button");
button.setAttribute("class", "fahrenheit");
button.innerHTML = "°F";
button.addEventListener("click", function() {
  if (isCelcius) {
    isCelcius = false;
    button.setAttribute("class", "celsius");
    button.textContent = "˚C";
  } else {
    isCelcius = true;
    button.setAttribute("class", "fahrenheit");
    button.textContent = "˚F";
  }

  temperatureChange();
});
currentTemperatureElement.appendChild(button);

function currentPosition(position) {
  let apiKey = "3fceae23dde22994db28dbf0244f6a96";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(handleCurrentPosition);
}

function handleCurrentPosition(response) {
  const currentCity = {
    id: response.data.id,
    name: "Current location"
  };

  setFavourites([currentCity].concat(favouriteCities));

  handleCityTemperature(response);
}

navigator.geolocation.getCurrentPosition(currentPosition);

//temperatures

let currentTemperature = 0;
let isCelcius = true;

function temperatureChange() {
  let temperature = document.querySelector(".temp");
  if (isCelcius) {
    temperature.innerHTML = `${currentTemperature}˚C`;
  } else {
    let fahrenheitTemperature = Math.round(currentTemperature * (9 / 5) + 32);
    temperature.innerHTML = `${fahrenheitTemperature}˚F`;
  }
}
