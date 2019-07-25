let $list, $input, $addBtn, $closePU, $cancelBtn, $popInput, $changeBtn;
let nextId = 1;
let editedTextId;

let firstList = ['dog', 'cat', 'food'];

main = () => {
    prepareDOMElements();
    prepareDOMEvents();
    //prepareInitialList();
    updateListFromServer();
    openPopup();
    closePopup();
}

prepareDOMElements = () => {
    $list = document.getElementById('list');
    $input = document.getElementById('newInput');
    $addBtn = document.getElementById('addBtn');
    $popInput = document.getElementById('ppContent');
    $closePU = document.getElementById('closePU');
    $cancelBtn = document.getElementById('cancelBtn');
    $changeBtn = document.getElementById('changeBtn');
}

prepareDOMEvents = () => {
    $addBtn.addEventListener('click', addButtonClickHandler);
    $closePU.addEventListener('click', closePopup);
    $cancelBtn.addEventListener('click', closePopup);
    $list.addEventListener('click', listClickManager);
    $changeBtn.addEventListener('click', acceptChangeHandler);
}

//prepareInitialList = () => {
  //  firstList.forEach(task => {
  //      addNewElementToList(task);
  // });
//}

let addButtonClickHandler = async() => {
    addNewElementToList($input.value);
    await axios.post('http://195.181.210.249:3000/todo/', {
        title: $input.value,
        author: 'Marta',
    });
}

addNewElementToList = (title) => {
    const newElement = createElement(title);
    $list.appendChild(newElement);
}

let updateListFromServer = async () => {
    await axios.get('http://195.181.210.249:3000/todo/', {
        title: title,
        author: 'Marta',
    });
    let listElement = document.createElement('li');
    $list.appendChild(listElement);
    //addNewElementToList ();
}

createElement = (title) => {
    const newElement = document.createElement('li');
    newElement.innerText = title;
    newElement.id = nextId;
    newElement.appendChild(createNewButton('Done', "done-" + nextId));
    newElement.appendChild(createNewButton('Edit', "edit-" + nextId));
    newElement.appendChild(createNewButton('Delete', "delete-" + nextId));

    nextId++;
    return newElement;
}

createNewButton = (btnRole, btnId) => {
    const newButton = document.createElement('button');
    newButton.innerText = btnRole;
    newButton.id = btnId;

    return newButton;
}

listClickManager = (eventObject) => {
    let action = eventObject.target.id.split('-')[0];
    let elementId = eventObject.target.id.split('-')[1];
    if (action === 'done') {
        markAsDone (elementId);
    } else if (action === 'delete') {
        deleteItem (elementId);
    } else if (action === 'edit') {
        editListElement(elementId);
    }
} 

let markAsDone = async (elementId) => {
    document.getElementById(elementId).classList.add('done');
    await axios.post('http://195.181.210.249:3000/todo/' + elementId, {
        author: 'Marta',
    });
}

let deleteItem = async (elementId) => {
    document.getElementById(elementId).remove();
    await axios.delete('http://195.181.210.249:3000/todo/' + elementId, {
        author: 'Marta',
    });
}

editListElement = (id) => {
    let editedText = document.getElementById(id).firstChild;
    editedTextId = id;
    openPopup();
    $popInput.value = editedText.textContent;
}

let acceptChangeHandler = async () => {
    let editedText = document.getElementById(editedTextId).firstChild;
    editedText.textContent = $popInput.value;
    await axios.put('http://195.181.210.249:3000/todo/' + editedTextId, {
        title: $popInput.value,
        author: 'Marta',
    });
    closePopup();
}

openPopup = () => {
    document.getElementById('popUp').style.display = "block";
}

closePopup = () => {
    document.getElementById('popUp').style.display = "none";
}

document.addEventListener('DOMContentLoaded', main);