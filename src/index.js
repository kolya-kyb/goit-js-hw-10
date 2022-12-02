import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let items = [];

const getItemtemplateCountries = ({ name: { official }, flags: { svg } }) =>
  ` <li class="item">
  <img src="${svg}" width="30px" height="30px"  >
      <span> ${official} </span> </li>`;

const getItemtemplateCountrie = ({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) =>
  `
  <ul>
  <li class="item"><img src="${svg}" width="30px" height="30px"> <h2>${official}</h2></li>
  <li class="item"><h3>Capital:</h3>${capital}<span></span></li>
  <li class="item"><h3>Population:</h3>${population}<span></span></li>
  <li class="item"><h3>Languages:</h3><span>${Object.values(
    languages
  )}</span></li></ul>`;

function renderCountry(country) {
  cleanerMark();
  if ((country.length > 1) & (country.length <= 10)) {
    let list = country.map(getItemtemplateCountries);
    refs.countryList.insertAdjacentHTML('beforeend', list.join(''));
  } else if (country.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else {
    let list = country.map(getItemtemplateCountrie);
    refs.countryInfo.insertAdjacentHTML('beforeend', list.join(''));
  }
}
function cleanerMark() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
function onInputChange(e) {
  let valueInput = e.target.value.trim();
  if (valueInput !== '') {
    fetchCountries(valueInput)
      .then(country => {
        items = country;
        renderCountry(items);
      })
      .catch(() => {
        cleanerMark();
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    cleanerMark();
  }
}

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
