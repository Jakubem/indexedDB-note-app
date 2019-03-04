(async () => {
  const noteSubmitBtn = document.querySelector('.note-submit-btn');
  const noteList = document.querySelector('.notes-list');

  const noteBody = document.querySelector('.add-note');
  const noteImg = document.querySelector('.note-img-input');
  const noteAlt = document.querySelector('.note-alt-input');

  const itemTemplate = (note) => {
    return `
    <img class="note-img" src="${note.img}" alt="${note.alt}">
    <div class="note-ui">
    <time datetime="${note.date}">${note.date}</time>
      <button class="note-remove-btn btn">usuń notatkę</button>
    </div>
    <p class="note-body">${note.body}</p>`
  }

  function createItem(note){
    const item = document.createElement('li');
    item.className = 'note-list-item';
    item.innerHTML = itemTemplate(note);
    return item
  }

  // create map to match object in indexedDB with corresponding note in HTML
  // we're gonna use it later to remove certain notes
  const map = new Map();

  // get previous notes if there are any
  let notes = await idbKeyval.get('notes');
  if (!notes) {
    // if not, create 'notes' in indexedDB
    idbKeyval.set('notes', [])
    .then(() => console.log('It worked!'))
    .catch(err => console.error('creation failed', err));
    notes = await idbKeyval.get('notes');
  } else {
    // render previous notes from template
    notes.forEach((el) => {
      const node = createItem(el);
      noteList.appendChild(node);
      map.set(node, el);
    });
  }

  noteSubmitBtn.addEventListener('click', addNote);
  // function for adding new notes
  function addNote() {
    // formatter, to render date in polish format
    const formatter = new Intl.DateTimeFormat('pl');
    // create note object
    const note = {
      body: noteBody.value,
      img: noteImg.value,
      alt: noteAlt.value,
      date: formatter.format(new Date)
    }

    // create HTML node from note object
    const node = createItem(note);
    // append created node in HTML
    noteList.appendChild(node);
    // put created node in Map to match it with note
    map.set(node, note);
    // push current note to notes object
    notes.push(note);
    // overwrite notes in indexedDB with notes
    idbKeyval.set('notes', notes)
    .catch(err => console.error('submit failed: ', err));
    // reset input values
    noteBody.value = '';
    noteImg.value = '';
    noteAlt.value = '';
  }

  // add single eventlistener and check target parent to remove specific item
  noteList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('note-remove-btn')) {
      // remove clicked button parent
      const clickedNote = e.target.parentNode.parentNode;
      clickedNote.remove();
      // get object corresponding with clicked note
      const clickedObj = map.get(clickedNote);
      // remove clicked note from indexedDB
      notes = notes.filter(el => el !== clickedObj);
      // submit updated notes array to indexedDB
      await idbKeyval.set('notes', notes)
        .catch(err => console.error('submit failed', err));
    }
  })
})()