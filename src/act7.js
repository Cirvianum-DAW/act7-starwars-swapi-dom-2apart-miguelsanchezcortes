import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);

  if (!movieId) {
    title.innerHTML = null;
    info.innerHTML = null;
    director.innerHTML = null;
  } else {
    // Obtenim la informació de la pelicula
    const movieInfo = await swapi.getMovieInfo(movieId);
    // Injectem
    title.innerHTML = movieInfo.name;
    info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
    director.innerHTML = `Director: ${movieInfo.director}`;
  }



}

async function initMovieSelect(selector) {
  const movies = await swapi.listMoviesSorted();
  const select = document.querySelector(selector);
  let option = document.createElement('option');
  option.value = '';
  option.innerHTML = 'Selecciona una pel·lícula';
  select.appendChild(option);
  movies.map((movie) => {
    const option = document.createElement('option');
    console.log(movie);
    option.value = _filmIdToEpisodeId(movie.episodeID);
    option.innerHTML = movie.name;
    select.appendChild(option);
  });

}

// function deleteAllCharacterTokens() {
//   let listCharacters = document.querySelector('.list__characters');
//   listCharacters.innerHTML = '';
// }

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {
  document.querySelector('.list__characters').innerHTML = '';
  const planeta = document.querySelector('#select-homeworld');
  planeta.addEventListener('change', _createCharacterTokens)
}

async function _createCharacterTokens() {
  const idPelicula = document.querySelector('#select-movie').value;
  const ul = document.querySelector('.list__characters');
  const planeta = document.querySelector('#select-homeworld').value;
  if (!idPelicula) {
    throw new Error('No s\'ha seleccionat cap pel·lícula');
  }
  if (!planeta) {
    throw new Error('No s\'ha seleccionat cap planeta');
  }
  const characters = (await swapi.getMovieCharactersAndHomeworlds(idPelicula)).characters;
  const filteredCharacters = characters.filter((character) => character.homeworld == planeta);

  const listCharacters = document.querySelector('.list__characters');
  listCharacters.innerHTML = '';
  filteredCharacters.forEach((character) => {
    const li = document.createElement('li');
    li.classList.add('list__characters', 'item', 'character');
    ul.appendChild(li);
    const img = document.createElement('img');
    const urlParts = character.url.split('/');
    const characterNumber = urlParts[urlParts.length - 1];
    img.src = `../public/assets/people/${characterNumber}.jpg`;
    img.classList.add('character__image');
    img.style.maxWidth = '100%';
    li.appendChild(img);

    const h2 = document.createElement('h2');
    h2.classList.add('character__name');
    h2.innerHTML = character.name;
    li.appendChild(h2);
    _addDivChild(li, 'character__birth', '<strong>Birth year:</strong> ' + character.birth_year);
    _addDivChild(li, 'character__eye', '<strong>Eye color:</strong> ' + character.eye_color);
    _addDivChild(li, 'character__gender', '<strong>Gender:</strong> ' + character.gender);
    _addDivChild(li, 'character__homeworld', '<strong>Homeworld:</strong> ' + character.homeworld);

  });
}

function _addDivChild(parent, className, html) {
  let div = document.createElement('div');
  div.className = className;
  div.innerHTML = html;
  parent.appendChild(div);
}

function setMovieSelectCallbacks() {
  const selectMovie = document.querySelector('#select-movie');
  selectMovie.addEventListener('change', _handleOnSelectMovieChanged);
}

async function _handleOnSelectMovieChanged(event) {
  // Obtenim el valor del selector que en aquest cas contindrà el número d'episodi
  const episodeID = event.target.value;
  // Obtenim les dades de la pel·lícula, però compte episodiID != filmID! :(
  await setMovieHeading(episodeID, '.movie__title', '.movie__info', '.movie__director');

  const selector = document.querySelector('#select-homeworld');
  selector.innerHTML = '';

  const caracters = await swapi.getMovieCharactersAndHomeworlds(episodeID);
  const homeworlds = caracters.characters.map((character) => character.homeworld);
  const homeworldsFiltered = _removeDuplicatesAndSort(homeworlds);
  _populateHomeWorldSelector(homeworldsFiltered);

  document.querySelector('.list__characters').innerHTML = '';
}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find((mapping) => mapping.e === episodeID);
  if (mapping) {
    return mapping.m;
  } else {
    return null;
  }
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _setMovieHeading({ name, episodeID, release, director }) {
}

function _populateHomeWorldSelector(homeworlds) {
  console.log(homeworlds);
  const selector = document.querySelector('#select-homeworld');
  selector.innerHTML = '';
  const option = document.createElement('option');
  option.value = '';
  option.innerHTML = 'Selecciona un planeta';
  selector.appendChild(option);
  homeworlds.forEach((homeworld) => {
    const option = document.createElement('option');
    option.value = homeworld;
    option.innerHTML = homeworld;
    selector.appendChild(option);
  });
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  const array = [...new Set(elements)];
  return array.sort();
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  // deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
