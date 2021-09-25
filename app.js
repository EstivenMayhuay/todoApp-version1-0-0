let $listSelection = document.getElementById('myTodoList'),
    $inputTask = document.getElementById('myInput'),
    $btnAdd = document.getElementById('btnAdd'),
    $modal = document.getElementById('modal');

let collectionLI = [];

function saveInStorage() {
  localStorage.setItem('taskList', JSON.stringify(collectionLI));
}

function displayStorageTask() {
  let arrayItemTask = JSON.parse(localStorage.getItem('taskList'));
  if(arrayItemTask != null) {
    collectionLI = arrayItemTask;
    displayTask();
  }
}

function addTask () {
  let textTask = $inputTask.value.trim();
  if(textTask === '') return alert('Please enter a text task');

  const objTask = {
    id: Date.now(),
    text: textTask,
    isDone: false
  }

  // add the object task into array list of items
  collectionLI.unshift(objTask);

  // save in the Storage
  saveInStorage();

  // show the task in the DOM
  displayTask();

  $inputTask.value = '';
  $inputTask.focus();
}

function deleteTask(e){
  const idTask = e.target.getAttribute('data-id');

  collectionLI.splice(collectionLI.findIndex(item => item.id == idTask), 1);

  saveInStorage();
  displayTask();
}

function editTask(e) {
  let listItem = e.target.parentElement,
      idTask = listItem.getAttribute('data-id'),
      indexTask = collectionLI.findIndex(item => item.id == idTask),
      objTask = collectionLI[indexTask];

  $modal.style.display = 'block';
  $modal.querySelector('input[type="text"').value = objTask.text;

  document.getElementById('btnCancel').addEventListener('click', () => {
    $modal.style.display = 'none';
  });

  document.getElementById('btnSave').addEventListener('click', () => {
    objTask.text = $modal.querySelector('input[type="text"').value.trim();
    $modal.style.display = 'none';

    saveInStorage();
    displayTask();
  });

}

function doneUndone(e){
  const idTask = e.target.getAttribute('data-id'),
        indexTask = collectionLI.findIndex(item => item.id == idTask);

  // if task.isDone is true put false but it's false put true
  collectionLI[indexTask].isDone
    ? (collectionLI[indexTask].isDone = false)
    : (collectionLI[indexTask].isDone = true);

  saveInStorage();
  displayTask();
}

function displayTask () {
  $listSelection.innerHTML = '';

  collectionLI.forEach( (objElem) => {
    // create tag element i and li
    const listItem = document.createElement('li'),
    textSpan = document.createElement('span'),
    btnEdit = document.createElement('i'),
    btnDelete = document.createElement('i');

    //listItem.textContent = objElem.text
    listItem.setAttribute('data-id', objElem.id);

    textSpan.textContent = objElem.text;

    btnEdit.setAttribute('data-id', objElem.id);
    btnEdit.classList.add('bx', 'bx-edit');

    btnDelete.setAttribute('data-id', objElem.id);
    btnDelete.classList.add('bx', 'bxs-trash-alt');

    listItem.appendChild(textSpan);
    listItem.appendChild(btnEdit);
    listItem.appendChild(btnDelete);

    $listSelection.appendChild(listItem);

    // task done
    //if(item.isDone)

    // event delete when the user click on the trash
    btnDelete.addEventListener('click', deleteTask);

    // event done when a task is finished
    listItem.addEventListener('click', doneUndone)

    // event edit a task
    btnEdit.addEventListener('click', editTask);
  });
}

displayStorageTask();

$btnAdd.addEventListener('click', addTask);

$inputTask.addEventListener('keydown', (e) => {
  if(e.key == "Enter") addTask();
});