import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearh, DEBOUNCE_DELAY));

function onInputSearh(event) {
  clearMarkup();
  const value = event.target.value.trim();
  if (value) {
    fetchCountries(value)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          const markup = renderCountriesMarkup(data);
          refs.countryList.insertAdjacentHTML('beforeend', markup);
        } else {
          const markup = createCountryMarkup(data);
          refs.countryInfo.insertAdjacentHTML('beforeend', markup);
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
}
function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function renderCountriesMarkup(data) {
  return data.reduce((acc, { name: { official }, flags: { svg } }) => {
    return (acc += `<li class="country-list__item">
    <div class="country-list__wrapper">
  <img class="country-list__flag" src ="${svg}" width ="80" height ="50">
  <p class="country-list__name">${official}</p>
  </div>
</li>`);
  }, '');
}

function createCountryMarkup(data) {
  return data.reduce(
    (
      acc,
      { name: { official }, flags: { svg }, population, languages, capital }
    ) => {
      return (acc += `
      <img class="country-info__flag" src="${svg}" width ="100" height ="80">
      <div class="country-info__wrapper">
        <h2 class="country-info__name"><span class="country-info__span">Name: </span>${official}</h2>
        <p class="country-info__capital"><span class="country-info__span">Capital: </span>${capital}</p>
        <p class="country-info__population"><span class="country-info__span">Population: </span>${population}</p>
        <p class="country-info__languages"><span class="country-info__span">Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>
      </div>`);
    },
    ''
  );
}
