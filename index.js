const notesDiv = document.querySelector(".notesDiv");

let notes = [
  {
    id: new Date(),
    title: "Sample Note",
    body: "This is the description of the sample note",
    backgroundColour: "MediumSeaGreen",
  },
];

// takes a html tag to create with its classes and returns the created element
const createElement = (tag, classes = []) => {
  const element = document.createElement(tag);
  classes.forEach((cl) => {
    element.classList.add(cl);
  });
  return element;
};

// method for adding notes to the notes div element
const createNewNoteView = (note) => {
  const noteDiv = createElement("div", ["note"]);
  noteDiv.id = note.id;
  const textDiv = createElement("div", ["text"]);
  textDiv.style.background = note.backgroundColour;
  const buttonsDiv = createElement("div", ["buttons"]);
  const titleP = createElement("b", ["title"]);
  titleP.innerHTML = note.title;
  const bodyP = createElement("p", ["body"]);
  bodyP.innerHTML = note.body;
  const editButton = createElement("button", ["edit"]);
  editButton.innerHTML = "Edit Note";
  const deleteButton = createElement("button", ["delete"]);
  deleteButton.innerHTML = "Delete Note";

  // Add title and body to text Div
  textDiv.append(titleP);
  textDiv.append(bodyP);
  noteDiv.append(textDiv);

  buttonsDiv.append(editButton);
  buttonsDiv.append(deleteButton);

  noteDiv.append(buttonsDiv);
  // set the button to call editNote, passing in the noteDiv it came from as a parameter, when clicked
  editButton.onclick = () => editNote(noteDiv);
  // set the buitton to call deleteNote, passing in the noteDiv it came from noteDiv as a parameter, when clicked
  deleteButton.onclick = () => deleteNote(noteDiv);

  console.log(note.id, note.title, note.body);
  return noteDiv;
};

const cancelEdit = (noteDiv) => {
  // get the title and description to the values entered in the div that was edited
  // get the old title and description from notes
  const note = notes.find((n) => n.id == noteDiv.id);

  const titleP = noteDiv.querySelector("b.title");
  titleP.contentEditable = false;
  titleP.innerHTML = note.title;

  const bodyP = noteDiv.querySelector("p.body");
  bodyP.contentEditable = false;
  bodyP.innerHTML = note.body;

  // Since editing has been cancelled, relabel edit button to its original
  const editButton = noteDiv.querySelector("button.edit");
  editButton.innerHTML = "Edit Note";

  // Since editing has been cancelled, relabel delete button to its original
  const deleteButton = noteDiv.querySelector("button.delete");
  deleteButton.innerHTML = "Delete Note";

  editButton.onclick = () => editNote(noteDiv);
  deleteButton.onclick = () => deleteNote(noteDiv);
};

// allow user to edit the note
const editNote = (noteDiv, editSave = false) => {
  const titleP = noteDiv.querySelector("b.title");
  titleP.contentEditable = true;
  // let the user edit the title first
  titleP.focus();
  const bodyP = noteDiv.querySelector("p.body");
  bodyP.contentEditable = true;

  // While editting, the edit button becomes the save note button
  const editButton = noteDiv.querySelector("button.edit");
  editButton.innerHTML = "Save Note";

  // While editing the note, we want the delete button to become the cancel edit button
  const deleteButton = noteDiv.querySelector("button.delete");
  deleteButton.innerHTML = "Cancel Edit";
  deleteButton.onclick = () => cancelEdit(noteDiv);

  // When the save button is clicked call this function again, with the parameter set to true,
  // indicating we want to save the note this time
  editButton.onclick = () => editNote(noteDiv, true);

  // if we want to save the note, do so
  if (editSave) {
    // get the noteDiv where the click came from
    const note = notes.find((n) => n.id == noteDiv.id);
    console.log(note.id, note.title, note.body);
    // set the title and description to the values entered in the div that was edited
    note.title = titleP.innerText.trim();
    note.body = bodyP.innerText.trim();

    // relabel the buttons back to their originals
    deleteButton.innerHTML = "Delete Note";
    editButton.innerHTML = "Edit Note";

    // Make the note read only now the edit has been confirmed
    titleP.contentEditable = false;
    bodyP.contentEditable = false;

    // change the onclick of the edit button to be editSave = false,
    // since the next time it will be clicked will be to allow the user to edit,
    // rather than saving their edits
    editButton.onclick = () => editNote(noteDiv);
  }
};

const saveNote = () => {
  const titleInput = document.querySelector("input#title");
  const bodyInput = document.querySelector("input#body");
  const bgColourInput = document.querySelector("select");
  const id = new Date();
  const note = {
    id: id,
    title: titleInput.value,
    body: bodyInput.value,
    backgroundColour: bgColourInput.value,
  };
  const noteDiv = createNewNoteView(note);
  notesDiv.prepend(noteDiv);
  titleInput.value = "";
  bodyInput.value = "";
  bgColourInput.value = "";
  // add the note to the array of notes
  notes.push(note);
};

document.querySelector("button.add").onclick = () => saveNote();

notes.forEach((note) => {
  const noteDiv = createNewNoteView(note);
  notesDiv.append(noteDiv);
});

const deleteNote = (noteDiv) => {
  // remove the div element from the document
  noteDiv.remove();
  notes = notes.filter((note) => note.id != noteDiv.id);
};
