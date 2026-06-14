import { dummyMovies, movieDetails } from "./data.js";

const BASE_URL = "http://www.omdbapi.com/?apikey";
const API_KEY = "getyourownapi";

const movieListEl = document.getElementById("movie-list");
const searchForm = document.querySelector("form");

let movieListDetails = [];
let watchlist = [];

async function getMovieListImdb(apiKey, searchKeyword, dataLenght = 5) {
  const res = await fetch(`${BASE_URL}=${apiKey}&s=${searchKeyword}`);
  const data = await res.json();
  if (data.Search.length > 0) {
    const selectedData = await data.Search.slice(0, dataLenght).map(
      (mov) => mov.imdbID,
    );
    return selectedData;
  } else {
    return "Unable to find what you're looking for. Please try another search.";
  }
}

async function getMovieDetail(apiKey, imdbID) {
  const res = await fetch(`${BASE_URL}=${apiKey}&i=${imdbID}`);
  const data = await res.json();
  return data;
}

async function savingMovieList(imdbArr) {
  let imdbData = await imdbArr;
  imdbData.forEach(async (imdb) => {
    if(movieListDetails.length === 5){
      movieListDetails = []
    }
    movieListDetails.push(await getMovieDetail(API_KEY, imdb));
    renderMovieList(movieListDetails)
  });
}

function renderMovieList(movieDataArr) {
  let movieDom = "";
  movieDataArr.forEach(
    (movie) =>
      (movieDom += `<div>
            <div>
                <img src="${movie.Poster}">
            </div>
            <div>
                <h2>${movie.Title}</h2>
                <div>
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <div>
                        <button class="add-watchlist" data-imdbserial=${movie.imdbID}>+</button>
                        <p>${movie.imdbID}</p>
                    </div>
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </div>`),
  );
  movieListEl.innerHTML = movieDom;
  document.getElementById("empty-placeholder").style.display = "none";
  document.querySelectorAll(".add-watchlist").forEach((element) => {
    element.addEventListener("click", (event) => {
      let data = event.target.dataset.imdbserial;
      saveToWatchlist(data, movieListDetails);
    });
  });
}

function saveToWatchlist(imdbID, movieData) {
  //later add save to localstorage
  const savedMovie = movieData.find((data) => {
    return data.imdbID === imdbID;
  });
  watchlist.push(savedMovie);
  console.log(watchlist);
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userSearch = document.getElementById("movie-title").value;
  const imdbArray = await getMovieListImdb(API_KEY, userSearch); //1 array[123,123]
  if (imdbArray.length > 0) {
    savingMovieList(imdbArray); // 2
  } else {
    document.getElementById("empty-placeholder").innerHTML = imdbArray;
  }

  document.getElementById("movie-title").value = "";
});
