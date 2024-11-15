const REGEX = /^\d+$/g;

const form = document.getElementById('form');
const inputs = document.querySelectorAll('#form input');
const expires = document.querySelectorAll('input[name="expire"]');
const cvc = document.getElementById('cvc');

const requiredLength = {
  cardNumber: 16,
  expire: 4,
  cvc: 3,
};

function validateNumberInput(key, value) {
  let val = value;
  if (key === 'cardNumber') val = +val.replaceAll(' ', '').trim();
  if (key === 'expire') val = +val.replaceAll('/', '').trim();
  if (typeof +val !== 'number' || isNaN(+val)) generateErrorState(key, 'Wrong format, numbers only');
  if (typeof +val === 'number' && !isNaN(+val)) checkInputLength(key, value);
}

function checkInputLength(key, value) {
  let val = value;
  if (key === 'cardNumber') val = val.replaceAll(' ', '').trim();
  else if (key === 'expire') val = val.replaceAll('/', '').trim();
  else if (val.length !== requiredLength[key]) generateErrorState(key, `Must be ${requiredLength[key]} characters`);
}

function validateExpireDate(value) {
  const date = value.split('/');
  const currentYear = new Date().getFullYear().toString().slice(2);

  if (+date.at(0) > 12 || isNaN(+date.at(0))) generateErrorState('expire', 'Invalid date');
  if (+date.at(1).trim() < +currentYear) generateErrorState('expire', 'Expired credit card');
}

function validateInput(formData) {
  for (const [key, value] of Object.entries(formData)) {
    if (!value) generateErrorState(key);
    else if (key === 'expire') validateExpireDate(value);
    else if (key !== 'name') validateNumberInput(key, value);
  }
}

function generateErrorState(inputName, message) {
  const errorMsg = message || "Can't be blank";
  const inputRow = document.querySelector(`input[name="${inputName}"]`)?.closest('div[class*="input-row"]');
  generateErrorMessage(inputRow, errorMsg);
}

function generateErrorMessage(container, message) {
  container?.classList.add('error');
  container?.querySelector('.error-msg')?.remove();
  container?.insertAdjacentHTML('beforeend', `<p class="error-msg">${message}</p>`);
}

function blockKeypress(event, maxLength) {
  const { target: input } = event;
  const value = input.value.trim();
  if (value.length === maxLength) input.nextElementSibling?.focus();
  if (value.length > maxLength) input.value = input.value.trim().slice(0, maxLength);
}

function extractFormData(form) {
  const formData = new FormData(form);
  const expireDate = formData.getAll('expire').join('/').trim();
  return {
    name: formData.get('name'),
    cardNumber: formData.get('cardNumber'),
    expire: expireDate === '/' ? '' : expireDate,
    cvc: formData.get('cvc'),
  };
}

function changeFocusOnDelete(event) {
  if (event.key !== 'Backspace') return;
  if (!event.target.value.trim()) event.target.closest('div').previousElementSibling.querySelector('input').focus();
}

function changeFocusToNextInput(event) {
  const wrapper = event.target.closest('.input-wrapper');
  if (event.target.value.trim().length === 2) wrapper.nextElementSibling.querySelector('input').focus();
}

function errorExists() {
  return document.querySelectorAll('.error').length > 0;
}

function displayConfirmPage() {
  document.querySelector('.section--2').classList.add('hidden');
  document.querySelector('.section--3').classList.remove('hidden');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = extractFormData(event.target);
  validateInput(formData);
  const hasError = errorExists();
  if (hasError) return;
  event.target.reset();
  displayConfirmPage();
});

expires.forEach(exp => exp.addEventListener('input', event => blockKeypress(event, 2)));
cvc.addEventListener('input', event => blockKeypress(event, 3));
document.getElementById('expire-2').addEventListener('keydown', changeFocusOnDelete);

inputs.forEach(input => {
  input.addEventListener('input', () => {
    const row = input.closest('div[class*="input-row"]');
    const errorMsg = row.querySelector('.error-msg');
    row.classList.contains('error') && row.classList.remove('error');
    errorMsg?.remove();
  });
});

expires[0].addEventListener('input', changeFocusToNextInput);
