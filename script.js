window.addEventListener("DOMContentLoaded", () => {
  const itemsWrapper = document.querySelector(".work-area__wrapper-items");
  const buttonSubmitAdd = document.querySelector(".submit-add");
  const buttonSubmitEdit = document.querySelector(".submit-edit");
  const textareaAdd = document.querySelector(".textarea-add");
  const textareaEdit = document.querySelector(".textarea-edit");
  const formEdit = document.querySelector(".work-area__form-edit");
  const formAdd = document.querySelector(".work-area__form-add");

  const tasks = [];
  let id = 1;

  function addTask(isChecked, stringText) {
    let task = {
      id: id++,
      checked: isChecked,
      text: stringText,
    };
    if (task['text'].match(/\S/g)) {
      tasks.push(task);
    } else {
      console.log('Textarea value is empty')
    }
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

  function deleteTask(id) {
    const task = tasks.find((task) => task.id === id);
    const taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);
  }

  // function enableAndDisableButtonSubmit() {
  //   if (textareaAdd.value === '' || textareaEdit.value === ''){
  //     buttonSubmitAdd.setAttribute('disabled', true)
  //   } else {
  //     buttonSubmitAdd.removeAttribute('disabled')
  //   }
  // }

  function createItemLocalStorage() {
    localStorage.setItem("id", id);
    tasks.forEach((task, i) => {
      const serialTask = JSON.stringify(task);
      console.log(serialTask);
      localStorage.setItem(task.id, serialTask);
    });
  }

  function deleteItemLocalStorage(id) {
    localStorage.removeItem(id);
  }

  function getItemLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key === "id") {
        id = localStorage.getItem(key);
        continue;
      }
      const item = JSON.parse(localStorage.getItem(key));
      tasks.push(item);
      console.log(tasks);
    }
    tasks.sort((a, b) => (a["id"] > b["id"] ? 1 : -1));
    console.log(tasks);
  }

  function createTasksElement(parentSelector) {
    const parent = document.querySelector(parentSelector);

    tasks.forEach((task) => {
      const element = document.createElement("div");
      element.setAttribute("id", task["id"]);
      element.classList.add("work-area__wrapper-item");
      if (task["checked"]) {
        element.innerHTML = `
        <button class="checked"></button>
        <div class="items-title">${task["text"]}</div>
        <button class="edit"></button>
        <button class="delete"></button>
        <div class="line block"></div>
        `;
      } else {
        element.innerHTML = `
        <button class="not-checked"></button>
        <div class="items-title">${task["text"]}</div>
        <button class="edit"></button>
        <button class="delete"></button>
        <div class="line none"></div>
        `;
      }

      parent.append(element);
      textareaAdd.value = "";
    });
  }

  function deleteAllElement() {
    const allElement = document.querySelectorAll(".work-area__wrapper-item");
    allElement.forEach((element) => {
      element.remove();
    });
  }

  function editElement(id) {
    buttonSubmitEdit.addEventListener("click", () => {
      editText(textareaEdit.value, id);
      createItemLocalStorage();
      deleteAllElement();
      createTasksElement(".work-area__wrapper-items");
      formEdit.classList.add("none");
      formAdd.classList.remove("none");
    });
  }

  function operationsOnElements() {
    itemsWrapper.addEventListener("click", (event) => {
      if (event.target && event.target.classList.contains("delete")) {
        let parentId = event.target.parentElement.getAttribute("id");
        deleteTask(Number(parentId));
        deleteItemLocalStorage(Number(parentId));
        deleteAllElement();
        createTasksElement(".work-area__wrapper-items");
      } else if (
        event.target &&
        (event.target.classList.contains("not-checked") ||
          event.target.classList.contains("checked"))
      ) {
        let parent = event.target.parentElement;
        const lineChecked = parent.querySelector(".line");
        const editButton = parent.querySelector(".edit");

        if (event.target.classList.contains("not-checked")) {
          toogleTask(Number(parent.getAttribute("id")));
          event.target.classList.add("checked");
          lineChecked.classList.add("block");
          event.target.classList.remove("not-checked");
          lineChecked.classList.remove("none");
          editButton.setAttribute("disabled", true);
          createItemLocalStorage();
        } else {
          toogleTask(Number(parent.getAttribute("id")));
          event.target.classList.add("not-checked");
          lineChecked.classList.add("none");
          event.target.classList.remove("checked");
          lineChecked.classList.remove("block");
          editButton.removeAttribute("disabled");
          createItemLocalStorage();
        }
      } else if (event.target && event.target.classList.contains("edit")) {
        formEdit.classList.remove("none");
        formAdd.classList.add("none");
        let parent = event.target.parentElement;
        const title = parent.querySelector(".items-title").textContent;
        itemsWrapper.removeChild(parent);
        textareaEdit.value = title;
        editElement(Number(parent.getAttribute("id")));
        createItemLocalStorage();
      }
      console.log(tasks);
    });
  }

  function createNewElement() {
    buttonSubmitAdd.addEventListener("click", () => {
      addTask(false, textareaAdd.value);
      deleteAllElement();
      createTasksElement(".work-area__wrapper-items");
      createItemLocalStorage();
    });
  }

  getItemLocalStorage();
  createTasksElement(".work-area__wrapper-items");
  createNewElement();
  operationsOnElements();
});
