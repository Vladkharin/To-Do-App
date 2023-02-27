window.addEventListener("DOMContentLoaded", () => {
  const itemsWrapper = document.querySelector(".work-area__wrapper-items");
  const buttonSubmit = document.querySelector(".submit");
  const textarea = document.querySelector(".textarea");

  itemsWrapper.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("delete")) {
      itemsWrapper.removeChild(event.target.parentElement);
    } else if (
      event.target &&
      (event.target.classList.contains("not-checked") ||
        event.target.classList.contains("checked"))
    ) {
      let parent = event.target.parentElement;
      // console.log(parent)
      const lineChecked = parent.querySelector(".line");
      const editButton = parent.querySelector(".edit");

      if (event.target.classList.contains("not-checked")) {
        event.target.classList.add("checked");
        lineChecked.classList.add("block");
        event.target.classList.remove("not-checked");
        lineChecked.classList.remove("none");
        editButton.setAttribute("disabled", true);
      } else {
        event.target.classList.add("not-checked");
        lineChecked.classList.add("none");
        event.target.classList.remove("checked");
        lineChecked.classList.remove("block");
        editButton.setAttribute("disabled", false);
      }
    } else if (event.target && event.target.classList.contains("edit")) {
      let parent = event.target.parentElement;
      const title = parent.querySelector(".items-title").textContent;
      itemsWrapper.removeChild(event.target.parentElement);
      textarea.value = title;
    }
  });

  function classElem() {
    class workAreaItem {
      constructor(title, parentSelector) {
        this.title = title;
        this.parentSelector = document.querySelector(parentSelector);
      }

      render() {
        if (this.title.length < 1 && this.title === "") {
          this.title = "Ничего не ввели в задачи";
        }

        // console.log(this.title)

        const element = document.createElement("div");
        element.classList.add("work-area__wrapper-item");
        element.innerHTML = `
                <button class="not-checked"></button>
                <div class="items-title">${this.title}</div>
                <button class="edit"></button>
                <button class="delete"></button>
                <div class="line none"></div>
                `;

        this.parentSelector.append(element);
      }
    }

    new workAreaItem(textarea.value, ".work-area__wrapper-items").render();
  }

  function createElement() {
    buttonSubmit.addEventListener("click", classElem);
  }

  createElement();
});
