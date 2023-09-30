import { fetchImagesData } from './images-api';
import SimpleLightbox from 'simplelightbox';
import '../node_modules/simplelightbox/dist/simple-lightbox.css';
import Notiflix from 'notiflix';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
let gallery;
let newSearch;

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  newSearch = true;
  if (newSearch) {
    galleryEl.innerHTML = '';
  }
  const searchQuery = e.target.elements.searchQuery.value;
  fetchImagesData(searchQuery, newSearch)
    .then(renderImageCards)
    .catch(error => {
      console.log(error);
      if (error.message === 'No images found') {
        getErrorMessage(error.message);
      } else {
        getErrorMessage('An error occurred while fetching images');
      }
    });
  newSearch = false;
}

function renderImageCards(imagesData) {
  const cardsMarcup = imagesData
    .map(
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
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', cardsMarcup);

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
}

export function getErrorMessage(message) {
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

//hitscounter fixed
//hits end
//styles