(async () => {
  const noteImgPath = document.querySelector('.note-img-input');
  const noteImgAlt = document.querySelector('.note-alt-input');
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
  const map = new Map();
  let notes = await idbKeyval.get('notes');
  if (!notes) {
    idbKeyval.set('notes', [])
    .then(() => console.log('It worked!'))
    .catch(err => console.log('It failed!', err));
    notes = await idbKeyval.get('notes');
  } else {
    notes.forEach((el) => {
      const node = createItem(el);
      noteList.appendChild(node);
      map.set(node, el);
    });
  }

  noteSubmitBtn.addEventListener('click', addNote);

  function addNote() {
    const formatter = new Intl.DateTimeFormat( 'pl' );
    const note = {
      body: noteBody.value,
      img: noteImg.value,
      alt: noteAlt.value,
      date: formatter.format(new Date)
    }
    const node = createItem(note);
    noteList.appendChild(node);
    map.set(node, note);
    notes.push(note);
    idbKeyval.set('notes', notes)
    .catch(err => console.error('submit failed: ', err));
    noteBody.value = '';
    noteImg.value = '';
    noteAlt.value = '';
  }

  // add single eventlistener and check target parent to remove specific item
  noteList.addEventListener('click', async (e) => {
    if (e.target.className === 'note-remove-btn btn') {
      // remove clicked button parent
      const clickedNote = e.target.parentNode.parentNode;
      clickedNote.remove();
      const clickedObj = map.get(clickedNote);
      notes = notes.filter(el => el !== clickedObj);
      await idbKeyval.set('notes', notes)
        .catch(err => console.log('It failed!', err));
    }
  })
})()