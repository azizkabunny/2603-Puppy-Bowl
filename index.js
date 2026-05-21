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

// RENDER
function render() {
  const $app = document.querySelector('#app');

  $app.innerHTML = `
  <h1>Players</h1>
  <PlayerCollection></PlayerCollection>`;

  $app.querySelector('PlayerCollection').replaceWith(PlayerCollection());
}
async function init() {
  await getAllPlayers();
  // render();
}

init();

// render();

// getAllPlayers();
