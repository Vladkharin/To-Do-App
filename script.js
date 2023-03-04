const itemsWrapper = document.querySelector(".work-area__wrapper-items");
const buttonSubmitAdd = document.querySelector(".submit-add");
const buttonSubmitEdit = document.querySelector(".submit-edit");
const textareaAdd = document.querySelector(".textarea-add");
const textareaEdit = document.querySelector(".textarea-edit");
const formEdit = document.querySelector(".work-area__form-edit");
const formAdd = document.querySelector(".work-area__form-add");

let tasks = [];
let currentlyEditedId;

let autoId = 0;
function addTask(isChecked, text) {
  let task = {
    id: autoId,
    checked: isChecked,
    text: text,
  };

  tasks.push(task);
  autoId += 1;
}

function editText(textValue, id) {
  const task = tasks.find((task) => task.id === id);
  task["text"] = textValue;
}

function toogleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task["checked"]) {
    task["checked"] = false;
  } else {
    task["checked"] = true;
  }
}

function removeTask(id) {
  const task = tasks.find((task) => task.id === id);
  const taskIndex = tasks.indexOf(task);
  tasks.splice(taskIndex, 1);
}

function setLocalStorageData() {
  localStorage.setItem("currentlyEditedId", currentlyEditedId);
  localStorage.setItem("tasks", JSON.stringify({ tasks }));
}

function deleteItemLocalStorage(id) {
  removeTask(id);
  localStorage.setItem("tasks", JSON.stringify({ tasks }));
}

function getLocalStorageData() {
  currentlyEditedId = localStorage.getItem("currentlyEditedId");
  tasks = JSON.parse(localStorage.getItem("tasks") || `{ "tasks": [] }`).tasks.sort((a, b) =>
    a["id"] > b["id"] ? 1 : -1
  );
}

function displayTasks() {
  itemsWrapper.innerHTML = tasks
    .map(
      (task) => `
          <div id=${task.id} class="work-area__wrapper-item">
            <button class="${task.checked ? "checked" : "not-checked"}"></button>
            <div class="items-title">${task.text}</div>
            <button class="edit"></button>
            <button class="delete"></button>
            <div class="line ${task.checked ? "block" : "none"}"></div>
          </div>  
        `
    )
    .join("");
}

function handleEditButtonClick() {
  editText(textareaEdit.value, currentlyEditedId);
  setLocalStorageData();
  displayTasks();
  formEdit.classList.add("none");
  formAdd.classList.remove("none");
}

function deleteTask(event) {
  let parentId = event.target.parentElement.getAttribute("id");
  removeTask(Number(parentId));
  deleteItemLocalStorage(Number(parentId));
  displayTasks();
}

function checkTask(event) {
  let parent = event.target.parentElement;
  const lineChecked = parent.querySelector(".line");
  const editButton = parent.querySelector(".edit");

  toogleTask(Number(parent.getAttribute("id")));
  event.target.classList.add("checked");
  lineChecked.classList.add("block");
  event.target.classList.remove("not-checked");
  lineChecked.classList.remove("none");
  editButton.setAttribute("disabled", true);
  setLocalStorageData();
}

function uncheckTask(event) {
  let parent = event.target.parentElement;
  const lineChecked = parent.querySelector(".line");
  const editButton = parent.querySelector(".edit");

  toogleTask(Number(parent.getAttribute("id")));
  event.target.classList.add("not-checked");
  lineChecked.classList.add("none");
  event.target.classList.remove("checked");
  lineChecked.classList.remove("block");
  editButton.removeAttribute("disabled");
  setLocalStorageData();
}

function editTask(event) {
  formEdit.classList.remove("none");
  formAdd.classList.add("none");
  let parent = event.target.parentElement;
  const title = parent.querySelector(".items-title").textContent;
  itemsWrapper.removeChild(parent);
  textareaEdit.value = title;
  currentlyEditedId = Number(parent.getAttribute("id"));
  handleEditButtonClick();
  setLocalStorageData();
}

function handleWrapperClick(event) {
  const target = event.target;
  if (!target) return;

  if (target.classList.contains("delete")) {
    deleteTask(event);
  } else if (target.classList.contains("not-checked")) {
    checkTask(event);
  } else if (target.classList.contains("checked")) {
    uncheckTask(event);
  } else if (target.classList.contains("edit")) {
    editTask(event);
  }
}

function handleAddButtonClick() {
  addTask(false, textareaAdd.value);
  displayTasks();
  setLocalStorageData();
}

getLocalStorageData();
displayTasks();

buttonSubmitAdd.addEventListener("click", () => handleAddButtonClick());
itemsWrapper.addEventListener("click", (event) => handleWrapperClick(event));
buttonSubmitEdit.addEventListener("click", () => handleEditButtonClick());
