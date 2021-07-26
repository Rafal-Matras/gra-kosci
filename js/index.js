const btnAgain = document.querySelector('[data-btnAgain]');
const btnBack = document.querySelector('[data-back]');
const btnConfirm = document.querySelector('[data-confirm]');
const btnHome = document.querySelector('[data-btnHome]');
const btnRules = document.querySelector('[data-rules]');
const btnThrow = document.querySelector('[data-throw]');
const checked = document.querySelectorAll('[data-checked]');
const howManyThrows = document.querySelector('[data-howManyThrows]');
const endGame = document.querySelector('[data-endGame]');
const gameBones = document.querySelector('[data-gameBones]');
const main = document.querySelector('[data-main]');
const rulesText = document.querySelector('[data-rulesText]');
const selectedBones = document.querySelector('[data-selectedBones]');
const store = document.querySelector('[data-store]');
const welcome = document.querySelector('[data-welcome]');
const winText = document.querySelector('[data-win]');

const result = [];
let activePlayer = 1;
let end;
let endClick = 0;
let throwing = 0;
let trows = 3;
let playersNumber;
let score = 0;

const tableScores = [
  { name: '', score: '' },
  { name: 'jedynki', place: 'up', score: score },
  { name: 'dwójki', place: 'up', score: score },
  { name: 'trójki', place: 'up', score: score },
  { name: 'czwórki', place: 'up', score: score },
  { name: 'piątki', place: 'up', score: score },
  { name: 'szustki', place: 'up', score: score },
  { name: 'premia', place: 'up', score: 0 },
  { name: 'suma góra', place: 'up', score: 0 },
  { name: 'trójka', place: 'down', score: score },
  { name: 'czwórka', place: 'down', score: score },
  { name: 'full', place: 'down', score: score },
  { name: 'mały strit', place: 'down', score: score },
  { name: 'duży strit', place: 'down', score: score },
  { name: 'generał', place: 'down', score: score },
  { name: 'szansa', place: 'down', score: 0 },
  { name: 'suma dół', place: 'down', score: 0 },
  { name: 'razem', place: 'down', score: 0 },
];
const playerStore = [
  { name: 'player 1', bonus: true, sumaUp: 0, sumaDown: 0, suma: 0 },
  { name: 'player 2', bonus: true, sumaUp: 0, sumaDown: 0, suma: 0 },
  { name: 'player 3', bonus: true, sumaUp: 0, sumaDown: 0, suma: 0 },
  { name: 'player 4', bonus: true, sumaUp: 0, sumaDown: 0, suma: 0 },
];
const bonesNumber = [
  { name: 0, score: 1, active: true },
  { name: 1, score: 1, active: true },
  { name: 2, score: 1, active: true },
  { name: 3, score: 1, active: true },
  { name: 4, score: 1, active: true },
];

btnRules.addEventListener('click', () => {
  welcome.classList.remove('active');
  rulesText.classList.add('active');
});

btnBack.addEventListener('click', () => {
  welcome.classList.add('active');
  rulesText.classList.remove('active');
});

btnConfirm.addEventListener('click', () => {
  welcome.classList.remove('active');
  main.classList.add('active');
  checked.forEach(e => {
    if (e.checked === true) {
      playersNumber = Number(e.value);
    }
  });
  end = 13 * playersNumber;
  createNameScore();
  createScorePlayers();
  playerActive();
  createGame();
});

// generowanie tabeli z wynikami

const createNameScore = () => {
  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('category');
  tableScores.forEach(e => {
    const category = document.createElement('div');
    category.classList.add('main__box');
    category.innerText = `${e.name}`;
    if (
      e.name === '' ||
      e.name === 'suma dół' ||
      e.name === 'suma góra' ||
      e.name === 'premia' ||
      e.name === 'razem'
    ) {
      category.classList.add('main__bold');
    }
    categoryContainer.append(category);
  });
  store.append(categoryContainer);
  howManyThrows.innerText = `aby zacząć grę kliknij rzuć`;
};

const createScorePlayers = () => {
  for (let i = 1; i <= playersNumber; i++) {
    const playerContainer = document.createElement('div');
    playerContainer.classList.add('main__player');
    tableScores.forEach(e => {
      const player = document.createElement('div');
      player.classList.add('main__box-player');
      player.setAttribute('active', '');
      player.id = `${e.name}-${i}`;
      if (e.name === '') {
        player.innerText = `Gracz ${i}`;
        player.classList.add('main__bold');
        player.removeAttribute('active');
        player.setAttribute('data-player', `${i}`);
      }
      if (
        e.name === 'suma góra' ||
        e.name === 'suma dół' ||
        e.name === 'premia' ||
        e.name === 'razem'
      ) {
        player.classList.add('main__bold');
        player.removeAttribute('active');
        player.innerText = `${e.score}`;
      }
      playerContainer.append(player);

      player.addEventListener('mouseover', () => {
        if (player.hasAttribute('active') && activePlayer === i) {
          throwScore(e);
          player.innerText = `${score}`;
        }
      });
      player.addEventListener('mouseout', () => {
        if (player.hasAttribute('active') && activePlayer === i) {
          player.innerText = ``;
        }
      });
      player.addEventListener('click', () => {
        if (activePlayer === i && player.hasAttribute('active')) {
          player.innerText = `${score}`;
          player.classList.add('main__click');
          player.removeAttribute('active');
          nextPlayer();
          playerActive();
          clearBones();
          throwScore(e);
          addScore(e, i - 1);
          throwing = 0;
          trows = 3;
          score = 0;
          result.splice(0, 5);
          endClick++;
          howManyThrows.innerText = `kliknij rzuć`;
        }
        if (end === endClick) finish();
      });
    });
    store.append(playerContainer);
  }
};

const nextPlayer = () => {
  if (activePlayer < playersNumber) {
    activePlayer++;
  } else activePlayer = 1;
};

const playerActive = () => {
  const playerActiveInGame = document.querySelectorAll('[data-player]');
  playerActiveInGame.forEach(e => {
    if (Number(e.dataset.player) === activePlayer) {
      e.style.color = 'white';
    } else {
      e.style.color = 'black';
    }
  });
};

// generowanie pola gry

const createGame = () => {
  for (let i = 0; i < 5; i++) {
    const bone = document.createElement('img');
    bone.classList.add('main__bone');
    bone.classList.add(`main__bone${i}`);
    bone.setAttribute(`src`, `./img/dice-1.svg`);
    bone.id = i;
    gameBones.append(bone);
  }
  selectBoune();
};

const selectBoune = () => {
  const bones = document.querySelectorAll('.main__bone');
  bones.forEach(e => {
    e.addEventListener('click', () => {
      e.toggleAttribute('selected');
      bonesNumber[e.id].active = !bonesNumber[e.id].active;
      if (e.hasAttribute('selected')) {
        selectedBones.append(e);
        e.classList.add('main__bone-selected');
      } else {
        gameBones.append(e);
        e.classList.remove('main__bone-selected');
      }
    });
  });
};

// rozgrywka

btnThrow.addEventListener('click', () => {
  const boneActive = document.querySelectorAll('.main__bone');
  boneActive.forEach(e => e.classList.add('active'));
  if (throwing < 3) {
    result.splice(0, 5);
    score = 0;
    bonesNumber.forEach(e => {
      if (e.active) {
        const number = Math.floor(Math.random() * (7 - 1)) + 1;
        e.score = number;
        document
          .getElementById(`${e.name}`)
          .setAttribute(`src`, `./img/dice-${e.score}.svg`);
        result.push(e.score);
      } else result.push(e.score);
    });
    throwing++;
    if (throwing > 2) {
      btnThrow.classList.add('inactive');
    }
  }

  trows--;
  if (trows === 0) {
    howManyThrows.innerText = `nie możesz już rzucać `;
  } else if (trows > 0) {
    const troweLeft = trows === 1 ? `został 1 rzut` : `zostały ${trows} rzuty`;
    howManyThrows.innerText = `${troweLeft} `;
  }
});

const clearBones = () => {
  for (let i = 0; i < 5; i++) {
    const clearBone = document.getElementById(`${i}`);
    clearBone.removeAttribute('selected');
    clearBone.classList.remove('main__bone-selected');
    gameBones.append(clearBone);
    bonesNumber[i].active = true;
  }
  const bones = document.querySelectorAll('.main__bone');
  bones.forEach(e => {
    e.classList.remove('active');
    e.removeAttribute('selected');
    e.classList.remove('main__bone-selected');
    gameBones.append(e);
  });
  btnThrow.classList.remove('inactive');
};

//obliczanie wyników po rzucie

const throwScore = throwS => {
  switch (throwS.name) {
    case 'jedynki':
      up(1);
      break;
    case 'dwójki':
      up(2);
      break;
    case 'trójki':
      up(3);
      break;
    case 'czwórki':
      up(4);
      break;
    case 'piątki':
      up(5);
      break;
    case 'szustki':
      up(6);
      break;
    case 'trójka':
      few(3);
      break;
    case 'czwórka':
      few(4);
      break;
    case 'full':
      full();
      break;
    case 'mały strit':
      strit(1);
      break;
    case 'duży strit':
      strit(2);
      break;
    case 'generał':
      few(5);
      break;
    case 'szansa':
      if (result.length === 0) {
        score = 0;
      } else {
        score = result[0] + result[1] + result[2] + result[3] + result[4];
      }
      break;
  }
};

const up = x => {
  const number = result.filter(e => e === x);
  score = x * number.length;
};

const few = x => {
  const xSome = [];
  let a = false;
  result.forEach(e => (xSome[e] = result.filter(el => el === e)));
  xSome.forEach(e => {
    if (e.length >= x) {
      a = true;
    }
  });
  if (x === 5 && a) {
    score = 50;
  } else if (a) {
    score = result[0] + result[1] + result[2] + result[3] + result[4];
  } else score = 0;
};

const full = () => {
  let a = false;
  let b = false;
  const xSome = [];
  result.forEach(e => (xSome[e] = result.filter(el => el === e)));
  xSome.forEach(e => {
    if (e.length === 2) {
      a = true;
    }
  });
  xSome.forEach(e => {
    if (e.length === 3) {
      b = true;
    }
  });
  if (a && b) {
    score = 25;
  } else score = 0;
};

const strit = x => {
  let y = 0;
  for (let i = x; i < x + 5; i++) {
    let a = result.some(e => e === i);
    if (a) {
      y++;
    }
  }
  if (y === 5 && x === 1) {
    score = 30;
  } else if (y === 5 && x === 2) {
    score = 40;
  } else score = 0;
};

const addScore = (e, player) => {
  if (e.place === 'up') {
    playerStore[player].sumaUp = playerStore[player].sumaUp + score;
    if (playerStore[player].sumaUp >= 63 && playerStore[player].bonus) {
      document.getElementById(`premia-${player + 1}`).innerText = 35;
      playerStore[player].sumaUp = playerStore[player].sumaUp + 35;
      playerStore[player].bonus = false;
    }
    document.getElementById(`suma góra-${player + 1}`).innerText =
      playerStore[player].sumaUp;
  } else if (e.place === 'down') {
    playerStore[player].sumaDown = playerStore[player].sumaDown + score;
    document.getElementById(`suma dół-${player + 1}`).innerText =
      playerStore[player].sumaDown;
  }
  playerStore[player].suma =
    playerStore[player].sumaUp + playerStore[player].sumaDown;
  document.getElementById(`razem-${player + 1}`).innerText =
    playerStore[player].suma;
};

const finish = () => {
  const whoWon = [];
  for (let i = 1; i <= playersNumber; i++) {
    whoWon.push({ player: i, store: playerStore[i - 1].suma });
  }
  whoWon.sort((a, b) => a.store - b.store);
  whoWon.reverse();
  endGame.classList.add('active');
  let place = 1;
  whoWon.forEach(el => {
    const p = document.createElement('p');
    p.classList.add('end-game__p');
    p.innerText = `${place} miejsce: Player ${el.player} wynik ${el.store}`;
    winText.append(p);
    place++;
  });
};

btnHome.addEventListener('click', () => {
  endGame.classList.remove('active');
  welcome.classList.add('active');
  main.classList.remove('active');
  store.innerHTML = '';
  reset();
});

btnAgain.addEventListener('click', () => {
  endGame.classList.remove('active');
  store.innerHTML = '';
  reset();
  createNameScore();
  createScorePlayers();
  createGame();
});

const reset = () => {
  endClick = 0;
  score = 0;
  gameBones.innerHTML = '';
  playerStore.forEach(e => {
    let i = 1;
    e.name = `player ${i}`;
    e.bonus = 0;
    e.sumaUp = 0;
    e.sumaDown = 0;
    e.suma = 0;
    i++;
  });
};
