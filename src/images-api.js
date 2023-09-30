import axios from 'axios';
import Notiflix from 'notiflix';
import { getErrorMessage } from './index';

const myApiKey = '39755832-c186856aaaae5bdbab8f6e71b';
const BASE_URL = `https://pixabay.com/api/`;
let page = 1;
const perPage = 200;

export async function fetchImagesData(searchParam, newSearch) {
  if (newSearch) {
    page = 1;
  }
  const options = {
    params: {
      key: myApiKey,
      q: searchParam,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: perPage,
    },
  };
  try {
    const response = await axios.get(BASE_URL, options);
    if (response.data.hits.length === 0) {
      throw new Error('No images found');
    }
    hitsCounterMessage(page * perPage);
    page += 1;
    return response.data.hits;
  } catch (error) {
    throw error;
  }
}

function hitsCounterMessage(hits) {
  Notiflix.Notify.success(`Hooray! We found ${hits} images.`);
}
