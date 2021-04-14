"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


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
  let shows = [];
  let searchTerm = term;
  console.log(searchTerm);
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q="${searchTerm}`);
  console.log(response);
  let responseList = response.data;

//if no image, assign default otherwise use provided image
//loops over responseList
//pushes object with key:value pair of asked for informtion into an array
//return array for future use/other function use
  for (let i = 0; i < responseList.length; i++) {
    let showImage;
    if (response.data[i].show.image === null) {
      showImage = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";
    } else {
      showImage = response.data[i].show.image.medium;
    }
    shows.push({
      id: response.data[i].show.id,
      name: response.data[i].show.name,
      summary: response.data[i].show.summary,
      image: showImage
    })
    console.log(shows);
  }

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
              <button class="btn btn-outline-light btn-sm Show-getEpisodes">
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

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
