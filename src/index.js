import { fetchImagesData } from './images-api';
import SimpleLightbox from 'simplelightbox';
import '../node_modules/simplelightbox/dist/simple-lightbox.css';
import Notiflix from 'notiflix';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
let gallery;
let newSearch;
let hitsCounter = 0;

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  newSearch = true;
  if (newSearch) {
    galleryEl.innerHTML = '';
    hitsCounter = 0;
  }
  const searchQuery = e.target.elements.searchQuery.value;

  if (searchQuery.length < 2) {
    getErrorMessage('Please enter at least 2 characters');
    return;
  }

  fetchImagesData(searchQuery, newSearch)
    .then(renderImageCards)
    .catch(error => {
      if (error.message === 'No images found') {
        getErrorMessage(error.message);
      } else {
        getErrorMessage('An error occurred while fetching images');
      }
    });
  newSearch = false;
}

function renderImageCards({ totalHits, hits }) {
  hitsCounter += hits.length;
  const cardsMarcup = hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      `<a class="gallery__link" href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}">
        </a>
        <div class="img_info_wrapper">
          <p>Likes ${likes}</p>
          <p>Vievs ${views}</p>
          <p>Comments ${comments}</p>
          <p>Downloads ${downloads}</p>
        </div>`
  );
  galleryEl.insertAdjacentHTML('beforeend', cardsMarcup.join(''));
  Notiflix.Notify.success(`Hooray! We found ${hitsCounter} images.`);

  if (gallery) {
    gallery.refresh();
  } else {
    gallery = new SimpleLightbox('.gallery .gallery__link', {
      captionSelector: '.gallery__image',
      captionType: 'attr',
      captionsData: 'alt',
      captionDelay: 200,
    });
  }

  if (hitsCounter >= totalHits) {
    console.log(hitsCounter);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function getErrorMessage(message) {
  Notiflix.Notify.failure(message, {
    position: 'center-center',
    timeout: 1000,
    width: '300px',
    fontSize: '25px',
    borderRadius: '35px',
    backOverlay: true,
  });
}

window.addEventListener('scroll', onScroll);

function onScroll() {
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight
  ) {
    fetchImagesData(formEl.elements.searchQuery.value).then(renderImageCards);
  }
}

{
  /* <div>
  <ul class="gallery">CARDSLIST</ul>
</div> */
}
//styles
