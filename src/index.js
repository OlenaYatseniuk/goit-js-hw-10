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
  const value = event.target.value.trim();
  // console.log(value);

  if (value) {
    fetchCountries(value)
      .then(data => {
        console.log(data);
        if (data.length > 10) {
          console.log('more than 10');
          refs.countryList.innerHTML = '';
          refs.countryInfo.innerHTML = '';
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          console.log(' between 2 and 10');
          const markup = renderCountriesMarkup(data);
          refs.countryList.innerHTML = '';
          refs.countryInfo.innerHTML = '';
          refs.countryList.insertAdjacentHTML('beforeend', markup);
        } else {
          console.log('here');
          refs.countryList.innerHTML = '';
          refs.countryInfo.innerHTML = '';
          const markup = createCountryMarkup(data);
          refs.countryInfo.insertAdjacentHTML('beforeend', markup);
        }
      })
      .catch(error => {
        console.log(error);
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }
}

function renderCountriesMarkup(data) {
  return data.reduce((acc, { name: { official }, flags: { svg } }) => {
    console.log(official);
    console.log(svg);
    return (acc += `<li class="country-list__item">
    <div class="country-list__wrapper">
  <svg class="country-list__flag" width ="50" height ="50">
    <use href="${svg}"></use>
  </svg>
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
      <svg class="country-info__flag" width ="100" height ="100">
        <use href="${svg}"></use>
      </svg>
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
