'use strict';

function resetPage() {
  document.querySelector('.section--2').classList.remove('hidden');
  document.querySelector('.section--3').classList.add('hidden');
}

document.querySelector('.continue-btn').addEventListener('click', resetPage);
