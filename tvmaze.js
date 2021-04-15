"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");
const NULL_IMAGE = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  //takes term from submitted form value 
  //returns information about show matchingg term
  //example = response.data[index].show.id ==> path to show ID
  let searchTerm = term;
  console.log(searchTerm);
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q="${searchTerm}`);
  console.log(response);
  let responseList = response.data;

  //if no image, assign default otherwise use provided image
  //loops over responseList
  //pushes object with key:value pair of asked for informtion into an array
  //return array for future use/other function use
  //use map for looping to create new array
  //data = responseList array values? so its the objects themselves
  console.log("mapping")
  let shows = responseList.map(data => {
    let showImage = (data.show.image === null) ?
      NULL_IMAGE : data.show.image.medium;
    let keyToValue = {};

    keyToValue.id = data.show.id;
    keyToValue.name = data.show.name;
    keyToValue.summary = data.show.summary;
    keyToValue.image = showImage;
    console.log(keyToValue)
    return keyToValue;

  })
  return shows;
}


/** Given list of shows, create markup for each and append to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {

    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
          <div class="media">
            <img 
                src="${show.image}" 
                alt="${show.name}" 
                class="w-25 mr-3">
            <div class="media-body">
              <h5 class="text-primary">${show.name}</h5>
              <div><small>${show.summary}</small></div>
              <button id=${show.id} class="btn btn-outline-light btn-sm Show-getEpisodes">
                Episodes
              </button>
            </div>
          </div>  
        </div>
        `);

    $showsList.append($show);
  }

}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  //http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes --> api access 
  //returns information about episode matchingg term
  //how to get id of show?
  
  let showId = id;
  console.log(showId);
  let response = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
  console.log(response);
  let responseList = response.data;
  //loops over responseList
  //pushes object with key:value pair of asked for informtion into an array
  //return array for future use/other function use , using map
  let episodes = responseList.map(data => {
    let episodeKeyToValue = {
      id: data.id,
      name: data.name,
      season: data.season,
      number: data.number
    }
    return episodeKeyToValue;
  })

  console.log(episodes);
  return episodes;
}


/** Write a clear docstring for this function... */
//provided array of episodes (info is in objects)
//append to $episodesArea (ul) in document
//make <li> of each object key+value
async function populateEpisodes(id) {
  $episodesList.empty();
  let episodes = await getEpisodesOfShow(id);
  console.log(id)
  for (let episode of episodes) {
    console.log(episode);
    // $("#episodesList").append("<li>", episode)
    $("#episodesList").append(`<li>${episode.name} (Season: ${episode.season}, Episode: ${episode.number})</li>`)
  }
}

//click on episode button of show, event delegation
//will get id form button click which should pass id into functions

$("body").on("click", ".Show-getEpisodes", async function (evt) {
  evt.preventDefault();
  $episodesArea.show();
  console.log(evt.target, "event target")
  // let id = +evt.target.id; --> old way, by adding a diff id altogether
let id = $(evt.target).closest(".Show").data("show-id");
  console.log("this is the show id from closest data" + id)
  await populateEpisodes(id);
});

//$("body") vs $(evt.target) <-- somehow this works, why?
//evt.target gets evaluated into a string of something that exist in the document?
//"this" is being passed in, objects can be passed in
//i.e $(document).getReady? or something like that is similar 