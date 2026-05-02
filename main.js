const track = document.querySelector('.main__cases_slider_card_list');
const next = document.querySelector('.main__cases_slider_next');
const prev = document.querySelector('.main__cases_slider_prev');

const wrapper = document.querySelector('.main__cases_slider_wrapper');

function getCardWidth() {
  const card = document.querySelector('.main__cases_slider_card');
  return card.offsetWidth + 20;
}

function update() {
  const cards = [...track.querySelectorAll('.main__cases_slider_card')];

  const wrapperCenter =
    wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;

    const distance = Math.abs(wrapperCenter - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  });

  cards.forEach(card => {
    card.classList.remove('active', 'near');
  });

  if (cards[closestIndex]) cards[closestIndex].classList.add('active');
  if (cards[closestIndex - 1]) cards[closestIndex - 1].classList.add('near');
  if (cards[closestIndex + 1]) cards[closestIndex + 1].classList.add('near');
}

function setStart() {
  const width = getCardWidth();
  track.style.transform = `translateX(-${width}px)`;
}

function onNextTransitionEnd(width) {
  track.appendChild(track.firstElementChild);

  track.style.transition = 'none';
  track.style.transform = `translateX(-${width}px)`;

  update();
}

function moveNext() {
  const width = getCardWidth();

  track.prepend(track.lastElementChild);

  track.style.transition = 'none';
  track.style.transform = `translateX(0px)`;

  requestAnimationFrame(() => {
    track.style.transition = 'transform 0.35s ease-out';
    track.style.transform = `translateX(-${width}px)`;
  });

  track.addEventListener('transitionend', () => {
    requestAnimationFrame(() => update());
  }, { once: true });
}

function onPrevTransitionEnd(width) {
  update();
}

function movePrev() {
  const width = getCardWidth();

  track.appendChild(track.firstElementChild);

  track.style.transition = 'none';
  track.style.transform = `translateX(-${width * 2}px)`;

  requestAnimationFrame(() => {
    track.style.transition = 'transform 0.35s ease-out';
    track.style.transform = `translateX(-${width}px)`;
  });

  track.addEventListener('transitionend', () => {
    // CHANGED: синхронизация после layout
    requestAnimationFrame(() => update());
  }, { once: true });
}

next.addEventListener('click', moveNext);
prev.addEventListener('click', movePrev);

setStart();
update();