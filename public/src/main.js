const noteImgPath = document.querySelector('.note-img-input');
const noteImgAlt = document.querySelector('.note-alt-input');
const noteClearBtn = document.querySelector('.clear-note-btn');
const noteSubmitBtn = document.querySelector('.note-submit-btn');
const noteList = document.querySelector('.notes-list');

const noteBody = document.querySelector('.add-note');
const noteImg = document.querySelector('.note-img-input');
const noteAlt = document.querySelector('.note-alt-input');

/**
 * return HTML with user note
 * @param {obj} note - note value from user input or localStorage
 */
const itemTemplate = (note) => {
  return `
  <img class="note-img" src="${note.img}" alt="${note.alt}">
  <div class="note-ui">
  <time datetime="${note.date}">${note.date}</time>
    <button class="note-remove-btn btn">usuń notatkę</button>
  </div>
  <p class="note-body">${note.body}</p>`
}

/**
 * create HTML element from template
 * @param {obj} note - note value from user input or from IndexedDB
 */
function createItem(note){
  const item = document.createElement('li');
  item.className = 'note-list-item';
  item.innerHTML = itemTemplate(note);
  return item
}

// https://www.npmjs.com/package/idb-keyval

const notes = [{
  body: 'asdasdasd',
  img: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
  alt: 'asdasd',
  date: '2016 09 09'
},
{
  body: 'asdasdasd',
  img: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
  alt: 'asdasd',
  date: '2016 09 09'
}];

idbKeyval.set('hello', notes)
  .then(() => console.log('It worked!'))
  .catch(err => console.log('It failed!', err));

idbKeyval.get('hello').then(val => val.forEach(el => noteList.appendChild(createItem(el))))

noteSubmitBtn.addEventListener('click', addNote);

function addNote() {
  const formatter = new Intl.DateTimeFormat( 'pl' );
  const todo = {
    body: noteBody.value,
    img: noteImg.value,
    alt: noteAlt.value,
    date: formatter.format(new Date)
  }
  noteList.appendChild(createItem(todo));
}

// add single eventlistener and check target parent to remove specific item
noteList.addEventListener('click', (e) => {
  if (e.target.className === 'note-remove-btn btn') {
    // remove clicked button parent
    e.target.parentNode.parentNode.remove();
  }
})

noteClearBtn.addEventListener('click', () => {
  noteList.innerHTML = '';
});