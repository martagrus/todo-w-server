let $list, $input, $addBtn, $closePU, $cancelBtn, $popInput, $changeBtn;
let nextId = 1;
let editedTextId, tasksToShow;

main = () => {
    prepareDOMElements();
    prepareDOMEvents();
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

let addButtonClickHandler = async() => {
    addNewElementToList($input.value);
    await axios.post('http://195.181.210.249:3000/todo/', {
        title: $input.value,
        author: 'Marta',
        extra: 'ToDo',
    });
}

addNewElementToList = (title, id, extra) => {
    const newElement = createElement(title, id, extra);
    $list.appendChild(newElement);
    if (extra === 'Done') {
        document.getElementById(id).classList.add('done');
    };
}

let updateListFromServer = async () => {
    let todos = await axios.get('http://195.181.210.249:3000/todo/');
        todos.data.filter(el => {
            return el.author === 'Marta';
        }).forEach(task => {
            addNewElementToList(task.title, task.id, task.extra);
        });
}

createElement = (title, id, extra) => {
    const newElement = document.createElement('li');
    newElement.innerText = title;
    newElement.id = id;
    newElement.extra = extra;
    newElement.appendChild(createNewButton('Done', "done-" + id));
    newElement.appendChild(createNewButton('Edit', "edit-" + id));
    newElement.appendChild(createNewButton('Delete', "delete-" + id));

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

let markAsDone = async (id) => {
    document.getElementById(id).classList.add('done');
    await axios.put('http://195.181.210.249:3000/todo/' + id, {
        author: 'Marta',
        extra: 'Done',
    });
}

let deleteItem = async (id) => {
    document.getElementById(id).remove();
    await axios.delete('http://195.181.210.249:3000/todo/' + id);
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