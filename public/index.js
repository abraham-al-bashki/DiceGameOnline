const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const castDicebutton = document.getElementById('cast-dice');
const data = { username: '' };

checkUsername();

form.addEventListener('submit', function (e) {
  e.preventDefault();
  checkUsername();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});
castDicebutton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('cast dice', data);
});
socket.on('chat message', function (msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

function checkUsername() {
  const inputName = document.getElementById('input-name');
  console.log(data.username === '' && inputName !== null);
  if (data.username === '' && inputName !== null) {
    data.username = inputName.value;
    if (data.username !== '') {
      socket.emit('meta data', data);
    }
  }
  if (data.username === '') {
    messages.hidden = true;
    castDicebutton.hidden = true;
    form.textContent = '';
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', 'input-name');
    const labelText = document.createTextNode('Name: ');
    labelElement.appendChild(labelText);
    form.appendChild(labelElement);
    const inputElement = document.createElement('input');
    inputElement.setAttribute('id', 'input-name');
    inputElement.setAttribute('placeholder', 'Type name..');
    inputElement.setAttribute('autocomplete', 'off');
    form.appendChild(inputElement);
    const buttonElement = document.createElement('button');
    const SendButtonText = document.createTextNode('Confirm');
    buttonElement.appendChild(SendButtonText);
    form.appendChild(buttonElement);
  } else {
    messages.hidden = false;
    castDicebutton.hidden = false;
    form.textContent = '';
    form.appendChild(input);
    const buttonSubmit = document.createElement('button');
    const SendButtonText = document.createTextNode('Send');
    buttonSubmit.appendChild(SendButtonText);
    form.appendChild(buttonSubmit);
  }
}
