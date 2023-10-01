import axios from 'axios';
import Notiflix from 'notiflix';

const myApiKey = '39755832-c186856aaaae5bdbab8f6e71b';
const BASE_URL = `https://pixabay.com/api/`;
let page = 1;
const perPage = 40;

axios.defaults.params = {
  key: myApiKey,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: perPage,
};

export async function fetchImagesData(searchParam, newSearch) {
  if (newSearch) {
    page = 1;
  }

  const options = {
    params: {
      q: searchParam,
      page: page,
    },
  };

  try {
    const response = await axios.get(BASE_URL, options);
    if (response.data.hits.length === 0) {
      throw new Error('No images found');
    }
    page += 1;
    return response.data;
  } catch (error) {
    throw error;
  }
}
