const track = document.querySelector('.main__cases_slider_card_list');
const next = document.querySelector('.main__cases_slider_next');
const prev = document.querySelector('.main__cases_slider_prev');
const wrapper = document.querySelector('.main__cases_slider_wrapper');

let currentIndex = 1; // CHANGED: начинаем с 1 (из-за клона)

// CHANGED: ширина карточки + gap
function getCardWidth() {
  const card = document.querySelector('.main__cases_slider_card');
  const style = window.getComputedStyle(track);
  const gap = parseInt(style.columnGap || style.gap) || 18;

  return card.offsetWidth + gap;
}

// CHANGED: делаем ширину wrapper = 3 карточки
function setWrapperWidth() {
  const card = document.querySelector('.main__cases_slider_card');
  const style = window.getComputedStyle(track);
  const gap = parseInt(style.columnGap || style.gap) || 18;

  wrapper.style.width = `${card.offsetWidth * 3 + gap * 2}px`;
}

// CHANGED: создаём клоны для бесконечности
function setupLoop() {
  const cards = track.querySelectorAll('.main__cases_slider_card');

  const first = cards[0];
  const last = cards[cards.length - 1];

  const firstClone = first.cloneNode(true);
  const lastClone = last.cloneNode(true);

  track.appendChild(firstClone);
  track.prepend(lastClone);
}

// CHANGED: обновление позиции и активных классов
function update() {
  const cards = track.querySelectorAll('.main__cases_slider_card');

  cards.forEach(card => {
    card.classList.remove('active', 'near');
  });

  // центр = вторая видимая карточка
  const activeIndex = currentIndex + 1;

  if (cards[activeIndex]) {
    cards[activeIndex].classList.add('active');
  }

  if (cards[activeIndex - 1]) {
    cards[activeIndex - 1].classList.add('near');
  }

  if (cards[activeIndex + 1]) {
    cards[activeIndex + 1].classList.add('near');
  }

  const width = getCardWidth();
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

// CHANGED: проверка выхода в клоны
function checkLoop() {
  const cards = track.querySelectorAll('.main__cases_slider_card');
  const width = getCardWidth();

  // ушли в левый клон
  if (currentIndex === 0) {
    currentIndex = cards.length - 2;

    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * width}px)`;
  }

  // ушли в правый клон
  if (currentIndex === cards.length - 1) {
    currentIndex = 1;

    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * width}px)`;
  }
}

// CHANGED: движение вперёд
function moveNext() {
  currentIndex++;

  track.style.transition = 'transform 0.35s ease';
  update();

  track.addEventListener('transitionend', () => {
    checkLoop();
    update();
  }, { once: true });
}

// CHANGED: движение назад
function movePrev() {
  currentIndex--;

  track.style.transition = 'transform 0.35s ease';
  update();

  track.addEventListener('transitionend', () => {
    checkLoop();
    update();
  }, { once: true });
}

// события
next.addEventListener('click', moveNext);
prev.addEventListener('click', movePrev);

// CHANGED: инициализация
function init() {
  setupLoop();
  setWrapperWidth();
  update();
}

init();

// CHANGED: адаптация при ресайзе
window.addEventListener('resize', () => {
  setWrapperWidth();
  update();
});