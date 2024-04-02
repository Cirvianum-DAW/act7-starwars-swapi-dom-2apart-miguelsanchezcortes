import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);

  if(!movieId){
    title.innerHTML = null;
    info.innerHTML = null;
    director.innerHTML = null;
  } else{
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

function deleteAllCharacterTokens() {
  let listCharacters = document.querySelector('.list__characters');
  listCharacters.innerHTML = '';
}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {
  let selectHomeworld = document.querySelector('#select-homeworld');
  selectHomeworld.addEventListener('change', _createCharacterTokens, false);
}

async function _createCharacterTokens() {
  const ul = document.querySelector('.list__characters');
  let data = await swapi.getMovieCharactersAndHomeworlds(selectMovie.value);
  let characters = data.characters;
  let homeworlds = data.homeworlds;
  let selectedHomeworld = selectHomeworld.value;
  let filteredCharacters = characters.filter((character) => character.homeworld === selectedHomeworld);
  ul.innerHTML = '';
  filteredCharacters.map((character) => {
    let li = document.createElement('li');
    li.innerHTML = character.name;
    ul.appendChild(li);
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
  // const movieID = _filmIdToEpisodeId(episodeID);
  // const data = await swapi.getMovieInfo(movieID);
  // Actualitzem el header amb les dades de la pel·lícula
  // _setMovieHeading(data);
}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find((mapping) => mapping.e === episodeID);
  if (mapping) {
    return mapping.m;
  }else {
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
  const select = document.querySelector('#select-homeworld');
  select.innerHTML = '';
  homeworlds.forEach((homeworld) => {
    const option = document.createElement('option');
    option.value = homeworld.url;
    option.innerHTML = homeworld.name;
    select.appendChild(option);
  });
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
