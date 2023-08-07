const movieContainer = document.getElementById('movie-container');
const apiKey = '05773e7f1aa8a05015f47526f696b1f0';
let fresh = false;

function fetchLatestMovieId() {
  const url = `https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const latestMovieId = data.id;
      return latestMovieId;
    })
    .catch(error => {
      console.log("Erreur lors de la requête à l'API :", error);
      return null;
    });
}

function fetchRandomMovie() {
  return fetchLatestMovieId()
    .then(latestMovieId => {
      if (latestMovieId) {
        const randomMovieId = Math.floor(Math.random() * latestMovieId) + 1;
        const url = `https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=${apiKey}`;

        return fetch(url)
          .then(response => response.json())
          .then(data => {
            const randomMovie = data;
            return randomMovie;
          });
      } else {
        return null;
      }
    });
}

function isValidMovie(movie) {
  return (
    movie.title &&
    movie.release_date &&
    movie.vote_average &&
    movie.poster_path &&
    movie.title !== "undefined" &&
    movie.release_date !== "undefined" &&
    movie.vote_average !== "undefined" &&
    movie.poster_path !== "undefined"
  );
}

function createMovieObject(movie) {
  if (isValidMovie(movie)) {
    const title = movie.title;
    const originalTitle = movie.original_title;
    const year = movie.release_date.split('-')[0];
    const voteAverage = movie.vote_average;
    const posterPath = movie.poster_path;
    const trailer = getTrailerLink(movie.videos?.results);
    const genres = getGenres(movie.genres);
    const productionCountries = getProductionCountries(movie.production_countries);
    const overview = movie.overview;

    const movieObject = {
      title: title,
      originalTitle: originalTitle,
      year: year,
      voteAverage: voteAverage,
      posterPath: posterPath,
      trailer: trailer,
      genres: genres,
      productionCountries: productionCountries,
      overview: overview
    };

    return movieObject;
  } else {
    return null;
  }
}

function getTrailerLink(videos) {
  const trailer = videos?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
}

function getGenres(genres) {
  return genres ? genres.map(genre => genre.name).join(', ') : '';
}

function getProductionCountries(countries) {
  return countries ? countries.map(country => country.name).join(', ') : '';
}

function createMovieElement(movie) {
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie');

  const imageElement = document.createElement('div');
  imageElement.classList.add('movie__image');

  const posterElement = document.createElement('img');
  posterElement.classList.add('movie__poster');
  posterElement.alt = 'Affiche du film ' + movie.title;
  posterElement.src = 'https://image.tmdb.org/t/p/w500' + movie.posterPath;
  imageElement.appendChild(posterElement);

  const contentElement = document.createElement('div');
  contentElement.classList.add('movie__content');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('movie__title');
  titleElement.textContent = movie.title;
  contentElement.appendChild(titleElement);

  if (movie.originalTitle && movie.originalTitle !== movie.title) {
    const originalTitleElement = document.createElement('h3');
    originalTitleElement.classList.add('movie__original-title');
    originalTitleElement.textContent = movie.originalTitle;
    contentElement.appendChild(originalTitleElement);
  }

  const infoListElement = document.createElement('ul');
  infoListElement.classList.add('movie__info-list');

  if (movie.year) {
    const yearElement = document.createElement('li');
    yearElement.classList.add('movie__year');
    yearElement.textContent = movie.year;
    infoListElement.appendChild(yearElement);
  }

  if (movie.voteAverage) {
    const voteAverageElement = document.createElement('li');
    voteAverageElement.classList.add('movie__vote-average');
    voteAverageElement.textContent = movie.voteAverage;
    infoListElement.appendChild(voteAverageElement);
  }

  if (movie.genres) {
    const genresElement = document.createElement('li');
    genresElement.classList.add('movie__genres');
    genresElement.textContent = movie.genres;
    infoListElement.appendChild(genresElement);
  }

  if (movie.productionCountries) {
    const productionCountriesElement = document.createElement('li');
    productionCountriesElement.classList.add('movie__production-countries');
    productionCountriesElement.textContent = movie.productionCountries;
    infoListElement.appendChild(productionCountriesElement);
  }

  contentElement.appendChild(infoListElement);

  if (movie.overview) {
    const overviewElement = document.createElement('p');
    overviewElement.classList.add('movie__overview');
    overviewElement.textContent = movie.overview;
    contentElement.appendChild(overviewElement);
  }

  if (movie.trailer) {
    const trailerLinkElement = document.createElement('a');
    trailerLinkElement.classList.add('movie__trailer-link');
    trailerLinkElement.href = movie.trailer;
    trailerLinkElement.textContent = 'Bande annonce';
    contentElement.appendChild(trailerLinkElement);
  }

  movieElement.appendChild(imageElement);
  movieElement.appendChild(contentElement);

  return movieElement;
}

function displayMovieInfo(movie) {
  movieContainer.innerHTML = '';

  if (movie) {
    const movieElement = createMovieElement(movie);
    movieContainer.appendChild(movieElement);
  } else {
    fetchRandomMovie()
      .then(movie => {
        const movieObject = createMovieObject(movie);
        displayMovieInfo(movieObject);
      })
      .catch(error => {
        console.log("Erreur lors de la récupération du film aléatoire :", error);
      });
  }
}

// TRIGGER

// if (fresh = false) {
//   console.log('fresh')

//   fetchRandomMovie()
//     .then(movie => {
//       const movieObject = createMovieObject(movie);
//       displayMovieInfo(movieObject);
//     })
//     .catch(error => {
//       console.log("Erreur lors de la récupération du film aléatoire :", error);
//   });
// }

document.querySelector('button').addEventListener('click', (e) => {
  e.preventDefault();
  fresh = true;
  fetchRandomMovie()
    .then(movie => {
      const movieObject = createMovieObject(movie);
      displayMovieInfo(movieObject);
    })
    .catch(error => {
      console.log("Erreur lors de la récupération du film aléatoire :", error);
    });
});

document.addEventListener('keydown', (e) => {
  if (event.code === 'Space') {
    e.preventDefault();
    fresh = true;
    fetchRandomMovie()
      .then(movie => {
        const movieObject = createMovieObject(movie);
        displayMovieInfo(movieObject);
      })
      .catch(error => {
        console.log("Erreur lors de la récupération du film aléatoire :", error);
      });
  }
});
