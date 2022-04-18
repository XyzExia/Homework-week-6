
var apikey = "c3664e4d85f79b74c09e130f5ec75c03"

var searchHistArray = JSON.parse(localStorage.getItem("last-search")) || [];

function search(searchTerm) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=imperial&appid=c3664e4d85f79b74c09e130f5ec75c03`)
        .then(function (response) {
            console.log(response)
            return response.json();
            
        })
        .then(function (data) {
            document.getElementById('name').innerHTML = data.name;
            document.getElementById('temp').innerHTML = data.main.temp;
            document.getElementById('hum').innerHTML = data.main.humidity;
            document.getElementById('wind').innerHTML = data.wind.speed;

            var currentIcon = data.weather[0].icon;
            document.getElementById('current-icon').setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
            document.getElementById('description').innerHTML = data.weather[0].description;

            var lon = data.coord.lon;
            var lat = data.coord.lat;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=c3664e4d85f79b74c09e130f5ec75c03`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.getElementById('uv').innerHTML = data.current.uvi;

                    if (document.getElementById('uv').innerHTML < 3) {
                        document.getElementById('uv').classList.add("uvi-good");
                        document.getElementById('uv').classList.remove("class", "uvi-mod");
                        document.getElementById('uv').classList.remove("class", "uvi-warn");
                    } else if (document.getElementById('uv').innerHTML >= 3 && document.getElementById('uv').innerHTML <= 6) {
                        document.getElementById('uv').classList.add("class", "uvi-mod");
                        document.getElementById('uv').classList.remove("class", "uvi-good");
                        document.getElementById('uv').classList.remove("class", "uvi-warn");
                    } else {
                        document.getElementById('uv').classList.add("class", "uvi-warn");
                        document.getElementById('uv').classList.remove("class", "uvi-good");
                        document.getElementById('uv').classList.remove("class", "uvi-mod");
                    }
                })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=c3664e4d85f79b74c09e130f5ec75c03&units=imperial`)
        .then(function (response) {
                return response.json();
            })

        .then(function (data) {
                let fvdays = data.list.filter(day => day.dt_txt.includes('12:00:00'));
                for (let i = 0; i < fvdays.length; i++) {
                    let dateCard1 = new Date(fvdays[i].dt_txt).toLocaleString().split(',')[0];
                    document.getElementById(`date-card-${i}`).innerHTML = dateCard1;
                    let iconId = fvdays[i].weather[0].icon;
                    document.getElementById(`img-card-${i}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}@2x.png`);
                    document.getElementById(`temp-card-${i}`).innerHTML = Math.floor(fvdays[i].main.temp);
                    document.getElementById(`hum-card-${i}`).innerHTML = fvdays[i].main.humidity;
                    }
                })

        }).catch(function () {
            document.getElementById('name').innerHTML = "City not found!  Please try again.";
        });

    let today = new Date();
    document.getElementById('current-date').innerHTML = today.toDateString();

}

function renderHistory() {
    var quickSearchList = document.querySelector(".collection");
    quickSearchList.innerHTML = '';

    searchHistArray.forEach(function (city) {
        var searchHistoryEl = document.createElement("a");

        searchHistoryEl.setAttribute("href", "#!");
        searchHistoryEl.className = "collection-item";
        searchHistoryEl.classList.add("search-hist-el")
        searchHistoryEl.innerHTML = city.toUpperCase();
        quickSearchList.appendChild(searchHistoryEl);
    });
}


function onLoad() {
    if (localStorage.getItem("last-search") === null) {
        searchTerm = "Adelaide";
        search(searchTerm);
        localStorage.clear();
    } else {
        search(searchHistArray[searchHistArray.length - 1]);
        renderHistory();
    }
}

onLoad();



function saveSearchHistory(city) {
    if (!searchHistArray.includes(city)) {
        searchHistArray.push(city);
        localStorage.setItem("last-search", JSON.stringify(searchHistArray));
        console.log(searchHistArray);
    }
}

function deleteSearchHistory() {
    let searchHist = document.querySelector(".collection");
    searchHist.innerHTML = "";
}

document.getElementById('search-form').addEventListener("submit", function (event) {
    event.preventDefault();
    let searchInput = document.getElementById("search-input");
    let searchTerm = searchInput.value.toLowerCase().trim();
    console.log(searchTerm);
    search(searchTerm);
    saveSearchHistory(searchTerm);
    searchInput.value = "";
    renderHistory();
});

document.querySelector(".collection").addEventListener("click", function (event) {
    event.preventDefault();
    search(event.target.textContent);
    console.log(event.target.textContent);
    console.log("Hello");
    console.log(this);
});

document.getElementById('delete').addEventListener("click", function () {
    searchHistArray = [];
    localStorage.clear();
    deleteSearchHistory();
});
