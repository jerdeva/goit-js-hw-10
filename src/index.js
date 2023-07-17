import { fetchBreeds, fetchCatByBreed } from './cat-api';
import axios from 'axios';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';



const catInfoDiv = document.querySelector('.cat-info');
const errorText = (document.querySelector('.error')).hidden = true;
const loaderText = (document.querySelector('.loader'));
const select = document.querySelector('.breed-select');

axios.defaults.headers.common['x-api-key'] =
  'live_gdCBq7kc8Qri4R0WNVdzFYvdnmQDUhoi8cucKW423Kf7KYKirxUPJKz8vBGialpB';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';
  

fetchBreeds().then(response => {
  select.hidden = false;
  select.innerHTML = response.map(({ id, name }) => {
    return `<option class = "option" value="${id}">${name}</option>`;
  }).join('');
      new SlimSelect({
        select: '#single',
        settings: {
          showSearch: false,
          searchText: 'Sorry nothing to see here',
          searchPlaceholder: 'Search for the good stuff!',
          searchHighlight: true,
          },
          events: {
            afterChange: newVal => {
              loaderText.hidden = false;
              catInfoDiv.innerHTML = '';
              fetchCatByBreed(newVal[0].value)
                .then(responce => {
                  catInfoDiv.innerHTML = responce
                    .map(
                      ({ url, breeds: [{ name, description, temperament }] }) => {
                        return `
                        <div class = "cat_photo">
                        <img src="${url}" alt="${name}" ">
                        </div>
                        <div class = "cat_descript">
            <h3>${name}</h3>
            <p>${description}</p>
            <p><b>Temperament:&nbsp</b>${temperament}</p></div>`;
                      }
                    )
                    .join('');
                }).catch(() => {
                  Notiflix.Notify.failure(errorText.textContent);
                })
                .finally(() => (loaderText.hidden = true));
            },
          },
        }
);
  })
  .catch(() => {
    Notiflix.Notify.failure(errorText.textContent);
  })
  .finally(() => (loaderText.hidden = true));



