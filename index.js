// === Constants ===
const BASE = 'https://fsa-puppy-bowl.herokuapp.com/api';
const COHORT = '/2603-FTB-CT-WEB-PT'; // Make sure to change this!
const RESOURCE = '/players';
const API = BASE + COHORT + RESOURCE;

console.log('API', API);

// STATE
let players = [];
let selectedPlayer = null;

async function getAllPlayers() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    players = result.data.players;
    render();
  } catch (error) {
    console.error('Error fetching all players', error);
  }
}

async function removePlayer(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: 'DELETE',
    });
    selectedPlayer = null;
    await getAllPlayers();
  } catch (error) {
    console.error('Error while removing player', error);
  }
}

async function addPlayer(newPlayer) {
  try {
    await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayer),
    });
    await getAllPlayers();
  } catch (error) {
    console.error('Error while adding player', error);
  }
}

// COMPONENTS
function PlayerCard(player) {
  const $card = document.createElement('article');
  $card.classList.add('player');
  $card.innerHTML = `
  <img src="${player.imageUrl}" alt="${player.name}"/>
  <h2>${player.name}</h2>
  `;
  $card.addEventListener('click', function () {
    selectedPlayer = player;
    render();
  });
  return $card;
}

function PlayerCollection() {
  const $section = document.createElement('section');
  $section.classList.add('players');

  const playerCards = players.map(PlayerCard);
  $section.replaceChildren(...playerCards);
  return $section;
}

function SelectedPlayerDetails() {
  const $section = document.createElement('section');
  $section.classList.add('details');
  if (!selectedPlayer) {
    $section.innerHTML = `
    <h2>Selected Puppy</h2>
    <p>Please select puppy from the roster</p>`;

    return $section;
  }

  const teamName = selectedPlayer.team
    ? selectedPlayer.team.name
    : 'Unassigned';

  $section.innerHTML = `
    <img src="${selectedPlayer.imageUrl}" alt="${selectedPlayer.name}" />
    <p>Name${selectedPlayer.name}</p>
    <p>ID${selectedPlayer.id}</p>
    <p>Breed ${selectedPlayer.breed}</p>
    <p>Team ${teamName}</p>
    <p>Status ${selectedPlayer.status}</p>
    <button id="removeBtn">Remove from roster</button>
  `;
  $section.querySelector('#removeBtn').addEventListener('click', function () {
    removePlayer(selectedPlayer.id);
  });
  return $section;
}

function NewPlayerForm() {
  const $form = document.createElement('form');
  $form.innerHTML = `
  <h2>Invite a puppy</h2>
  <label>Name
  <input name="name" required />
  </label>
  <label>Breed
  <input name="breed" required />
  </label>
  <label>
      Status
      <select name="status">
        <option value="bench">Bench</option>
        <option value="field">Field</option>
      </select>
    </label>

    <label>
      Image URL
      <input name="imageUrl" />
    </label>

    <button>Invite a puppy</button>
  `;

  $form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData($form);
    const newPlayer = {
      name: formData.get('name'),
      breed: formData.get('breed'),
      status: formData.get('status'),
      imageUrl: formData.get('imageUrl'),
    };
    addPlayer(newPlayer);
    $form.reset();
  });
  return $form;
}

// RENDER
function render() {
  const $app = document.querySelector('#app');

  $app.innerHTML = `
  <h1>Puppy Bowl</h1>`;

  const main = document.createElement('main');

  const leftSide = document.createElement('section');
  leftSide.append(PlayerCollection(), NewPlayerForm());

  const rightSide = document.createElement('section');
  rightSide.append(SelectedPlayerDetails());

  main.append(leftSide, rightSide);
  $app.append(main);

  // $app.querySelector('PlayerCollection').replaceWith(PlayerCollection());
}
async function init() {
  await getAllPlayers();
  // render();
}

init();

// render();

// getAllPlayers();
