const EndPointText = document.getElementById('endPointText');
const FetchDataBtn = document.getElementById('fetchDataBtn');

const SearchInputText = document.getElementById('searchInputText');
const SearchApiEndPointBtn = document.getElementById('searchApiEndPointBtn');

const ApiEndPoints = document.getElementById('apiEndPoints');

const AlertPlaceholder = document.getElementById('liveAlertPlaceholder');
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

// Function to load api key and set to local var to use while api call
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
    info: 'Fetches lists of comics filtered by a character id',
  },
  {
    name: 'characters/{characterId}/events',
    info: 'Fetches lists of events filtered by a character id',
  },
  {
    name: 'characters/{characterId}/series',
    info: 'Fetches lists of series filtered by a character id',
  },
  {
    name: 'characters/{characterId}/stories',
    info: 'Fetches lists of stories filtered by a character id',
  },
];

(() => {
  populateApiEndPointList(ALL_AVAILABLE_PUBLIC_END_POINTS);
})();

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

let currentEndPoint;
const onEndPointTextChange = (e) => {
  const text = e.target.value;
  currentEndPoint = text;
  if (currentEndPoint.length) {
    FetchDataBtn.removeAttribute('disabled');
  } else {
    FetchDataBtn.setAttribute('disabled', true);
  }
};

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

EndPointText.addEventListener('input', onEndPointTextChange);
FetchDataBtn.addEventListener('click', handleOnFetchDataBtnClick);

SearchInputText.addEventListener('input', onSearchInputTextChange);
SearchApiEndPointBtn.addEventListener(
  'click',
  handleOnSearchApiEndPointBtnClick
);
