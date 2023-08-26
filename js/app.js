const EndPointText = document.getElementById('endPointText');
const FetchDataBtn = document.getElementById('fetchDataBtn');

const SearchInputText = document.getElementById('searchInputText');
const SearchApiEndPointBtn = document.getElementById('searchApiEndPointBtn');

// All API end points will be here
const ApiEndPoints = document.getElementById('apiEndPoints');

// AlertPlaceHolder which is one div for adding alert and removing as well
const AlertPlaceholder = document.getElementById('liveAlertPlaceholder');

// Function to append alert when response will come from server
const appendAlert = (primaryMsg, message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `<div><strong>${primaryMsg}</strong>${message}</div>`,
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  AlertPlaceholder.append(wrapper);
};

// Below three variable will contains all the initial value for sending request
let baseUrl = '';
let publicKey = '';
let privateKey = '';

// function to get api key from json file
async function loadApiKey() {
  try {
    const response = await fetch('api-key.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading API key:', error);
    return null;
  }
}

// Function to load api key and set to local var to use while api call (IIFE)
(async () => {
  const { BASE_URL, PUBLIC_KEY, PRIVATE_KEY } = await loadApiKey();
  if (BASE_URL && PUBLIC_KEY && PRIVATE_KEY) {
    // Use the API key in your code
    baseUrl = BASE_URL;
    publicKey = PUBLIC_KEY;
    privateKey = PRIVATE_KEY;
  } else {
    // Handle error or fallback
    console.error('API key not available.');
  }
})();

// all API end points array
const ALL_AVAILABLE_PUBLIC_END_POINTS = [
  {
    name: 'characters',
    info: 'Fetches lists of characters.',
  },
  {
    name: 'characters/{characterId}',
    info: 'Fetches a single character by id.',
  },
  {
    name: 'characters/{characterId}/comics',
    info: 'Fetches lists of comics filtered by a character id.',
  },
  {
    name: 'characters/{characterId}/events',
    info: 'Fetches lists of events filtered by a character id.',
  },
  {
    name: 'characters/{characterId}/series',
    info: 'Fetches lists of series filtered by a character id.',
  },
  {
    name: 'characters/{characterId}/stories',
    info: 'Fetches lists of stories filtered by a character id.',
  },
  {
    name: 'comics',
    info: 'Fetches lists of comics.',
  },
  {
    name: 'comics/{comicId}',
    info: 'Fetches a single comic by id.',
  },
  {
    name: 'comics/{comicId}/characters',
    info: 'Fetches lists of characters filtered by a comic id.',
  },
  {
    name: 'comics/{comicId}/creators',
    info: 'Fetches lists of creators filtered by a comic id.',
  },
  {
    name: 'comics/{comicId}/events',
    info: 'Fetches lists of events filtered by a comic id.',
  },
  {
    name: 'comics/{comicId}/stories',
    info: 'Fetches lists of stories filtered by a comic id.',
  },
  {
    name: 'creators',
    info: 'Fetches lists of creators.',
  },
  {
    name: 'creators/{creatorId}',
    info: 'Fetches a single creator by id.',
  },
  {
    name: 'creators/{creatorId}/comics',
    info: 'Fetches lists of comics filtered by a creator id.',
  },
  {
    name: 'creators/{creatorId}/events',
    info: 'Fetches lists of events filtered by a creator id.',
  },
  {
    name: 'creators/{creatorId}/series',
    info: 'Fetches lists of series filtered by a creator id.',
  },
  {
    name: 'creators/{creatorId}/stories',
    info: 'Fetches lists of stories filtered by a creator id.',
  },
  {
    name: 'events',
    info: 'Fetches lists of events.',
  },
  {
    name: 'events/{eventId}',
    info: 'Fetches a single event by id.',
  },
  {
    name: 'events/{eventId}/characters',
    info: 'Fetches lists of characters filtered by an event id.',
  },
  {
    name: 'events/{eventId}/comics',
    info: 'Fetches lists of comics filtered by an event id.',
  },
  {
    name: 'events/{eventId}/creators',
    info: 'Fetches lists of creators filtered by an event id.',
  },
  {
    name: 'events/{eventId}/series',
    info: 'Fetches lists of series filtered by an event id.',
  },
  {
    name: 'events/{eventId}/stories',
    info: 'Fetches lists of stories filtered by an event id.',
  },
  {
    name: 'series',
    info: 'Fetches lists of series.',
  },
  {
    name: 'series/{seriesId}',
    info: 'Fetches a single comic series by id.',
  },
  {
    name: 'series/{seriesId}/characters',
    info: 'Fetches lists of characters filtered by a series id.',
  },
  {
    name: 'series/{seriesId}/comics',
    info: 'Fetches lists of comics filtered by a series id.',
  },
  {
    name: 'series/{seriesId}/creators',
    info: 'Fetches lists of creators filtered by a series id.',
  },
  {
    name: 'series/{seriesId}/events',
    info: 'Fetches lists of events filtered by a series id.',
  },
  {
    name: 'series/{seriesId}/stories',
    info: 'Fetches lists of stories filtered by a series id',
  },
  {
    name: 'stories',
    info: 'Fetches lists of stories.',
  },
  {
    name: 'stories/{storyId}',
    info: 'Fetches a single comic story by id.',
  },
  {
    name: 'stories/{storyId}/characters',
    info: 'Fetches lists of characters filtered by a story id.',
  },
  {
    name: 'stories/{storyId}/comics',
    info: 'Fetches lists of comics filtered by a story id.',
  },
  {
    name: 'stories/{storyId}/creators',
    info: 'Fetches lists of creators filtered by a story id.',
  },
  {
    name: 'stories/{storyId}/events',
    info: 'Fetches lists of events filtered by a story id.',
  },
  {
    name: 'stories/{storyId}/series',
    info: 'Fetches lists of series filtered by a story id.',
  },
];

// At initial this function will show the api end points to the UI
(() => {
  populateApiEndPointList(ALL_AVAILABLE_PUBLIC_END_POINTS);
})();

// Function to populate all api end points, and push it to DOM
function populateApiEndPointList(endPointList) {
  endPointList.forEach((endPoint) => {
    const { name, info } = endPoint;

    const div = document.createElement('div');
    div.setAttribute(
      'class',
      'endPint rounded d-md-flex justify-content-md-between align-items-md-center'
    );

    const p = document.createElement('p');

    const apiInfo = document.createElement('span');
    apiInfo.setAttribute('class', 'badge rounded-pill text-bg-info');
    apiInfo.innerText = 'GET';
    p.appendChild(apiInfo);

    p.innerHTML += ` ${name}`;
    p.classList.add('fw-semibold');
    const span = document.createElement('span');
    span.innerText = info;

    div.appendChild(p);
    div.appendChild(span);

    ApiEndPoints.appendChild(div);
  });
}

// Function which will run on input,for sending api calls
let currentEndPoint;
const onEndPointTextInput = (e) => {
  const text = e.target.value;
  currentEndPoint = text;
  if (currentEndPoint.length) {
    FetchDataBtn.removeAttribute('disabled');
  } else {
    FetchDataBtn.setAttribute('disabled', true);
  }
};

// Function which will run on click of fetchData Button
const handleOnFetchDataBtnClick = async () => {
  // add disable property to input and button tag
  console.log('Yes data is coming...');
  FetchDataBtn.innerText = 'Fetching Data...';
  FetchDataBtn.setAttribute('disabled', true);
  EndPointText.setAttribute('disabled', true);
  const data = await getDataFromServer(currentEndPoint);
  EndPointText.removeAttribute('disabled');
  FetchDataBtn.removeAttribute('disabled');
  FetchDataBtn.innerText = 'Fetch Data';
  AlertPlaceholder.innerHTML = null;
  if (data?.code === 200) {
    console.log('API Response', data);
    appendAlert('SUCCESSFUL : ', ' Please check console for data!', 'success');
  } else {
    // show the error
    console.log(data);
    const { code, status } = data;
    if (code === 404) {
      appendAlert(
        'FAILED : ',
        ` ${status}, Please refer below END POINT Lists!`,
        'warning'
      );
    } else {
      appendAlert(
        `INVALID : ${status}, `,
        '  Please refer below END POINT Lists!',
        'danger'
      );
    }
  }
};

// Function which will fetch data from server
const getDataFromServer = async (endPoint) => {
  try {
    const finalURL = `${baseUrl}/${endPoint}?ts=1&apikey=${publicKey}&hash=${privateKey}`;
    const response = await fetch(finalURL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error calling API end point:', error.message);
    return { success: false, status: error.message };
  }
};

// Function which will run on Change of Search Input
let searchInputText;
const onSearchInputTextChange = (e) => {
  const text = e.target.value;
  searchInputText = text;
  if (!searchInputText) {
    // if text is empty then set all the available end pints
    ApiEndPoints.innerHTML = null;
    populateApiEndPointList(ALL_AVAILABLE_PUBLIC_END_POINTS);
  }
};

// Function which will run on click of SearchAPiEndPoint Button
const handleOnSearchApiEndPointBtnClick = () => {
  if (searchInputText) {
    ApiEndPoints.innerHTML = null;
    console.log(searchInputText);
    const filteredApiEndPointLists = ALL_AVAILABLE_PUBLIC_END_POINTS.filter(
      (endPoint) => endPoint.name.includes(searchInputText)
    );
    // filter endpoints based on text and populate the data into ui
    if (filteredApiEndPointLists.length) {
      populateApiEndPointList(filteredApiEndPointLists);
      console.log(filteredApiEndPointLists);
    } else {
      const p = document.createElement('p');
      p.innerText = `no match found for text ${searchInputText}`;
      ApiEndPoints.appendChild(p);
    }
  }
};

// Below are the eventlistener on targeted tags
EndPointText.addEventListener('input', onEndPointTextInput);
FetchDataBtn.addEventListener('click', handleOnFetchDataBtnClick);
SearchInputText.addEventListener('input', onSearchInputTextChange);
SearchApiEndPointBtn.addEventListener(
  'click',
  handleOnSearchApiEndPointBtnClick
);
