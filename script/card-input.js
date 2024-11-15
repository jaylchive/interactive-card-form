'use strict';

const cardNumber = document.getElementById('cardNumber');

function formatCardNumber(value) {
  const valueArr = value.replaceAll(' ', '').split('');
  const formattedNumber = valueArr.map((num, i) => {
    if ((i + 1) % 4 === 0) num += ' ';
    return num;
  });
  return formattedNumber.join('');
}

function handleCardNumber(event) {
  const value = event.target.value.trim().replaceAll(' ', '');
  event.target.value = formatCardNumber(value)
    .trim()
    .slice(0, 16 + 3);
}

cardNumber.addEventListener('input', handleCardNumber);
