function createTodoLi(todo) {
  // Select template Element
  const liTemplate = document.getElementById("todoTemplate");

  // Check if template element exists
  if (!todo || !liTemplate) return null;

  // Create clone of template element
  const liElement = liTemplate.content.querySelector("li").cloneNode(true);
  const divElement = liElement.querySelector(".alert");

  // Attach events for buttons
  const finishButton = liElement.querySelector(".mark-as-done");
  const removeButton = liElement.querySelector(".remove");
  const editButton = liElement.querySelector(".edit");

  // Declaration for local storage
  const todoList = getTodoList();
  const index = todo.id;

  // Set title and id of li element
  liElement.dataset.status = todoList[index - 1].status;
  liElement.querySelector(".todo_title").innerText = todo.title;
  liElement.querySelector(".todo_title").dataset.id = todo.id;

  // Render when run the web
  if (liElement.dataset.status === "completed") {
    finishButton.classList.add("btn-dark");
    finishButton.textContent = "Reset";
    divElement.classList.add("alert-success");
  } else {
    finishButton.classList.remove("btn-dark");
    finishButton.textContent = "Finish";
    divElement.classList.remove("alert-success");
  }

  // Attach event listeners to buttons
  if (finishButton && divElement && removeButton && editButton) {
    // Click event for finish button
    finishButton.addEventListener("click", () => {
      const todoList1 = getTodoList();
      const index1 = todo.id;
      const todo1Element = todoList1[index1 - 1];
      if (todo1Element.status === "pending") {
        liElement.dataset.status = "completed";
        todo1Element.status = "completed";
        finishButton.classList.add("btn-dark");
        finishButton.textContent = "Reset";
        divElement.classList.add("alert-success");
      } else {
        liElement.dataset.status = "pending";
        todo1Element.status = "pending";
        finishButton.classList.remove("btn-dark");
        finishButton.textContent = "Finish";
        divElement.classList.remove("alert-success");
      }
      localStorage.setItem("todo-list", JSON.stringify(todoList1));
    });

    // Click event for remove button
    removeButton.addEventListener("click", () => {
      const todoList = getTodoList();
      const newTodoList = todoList.filter((x) => x.id !== todo.id);
      localStorage.setItem("todo-list", JSON.stringify(newTodoList));
      liElement.remove();
    });

    // Click event for edit button
    // If you want to handle two click events on submit button, you can use if else to do it
    // Example: set data-id for form element, if true, handle edit submit, else handle add click
    editButton.addEventListener("click", function () {
      const todoList = getTodoList();
      const index = todo.id;
      const todoElement = todoList[index - 1];
      const submitEditBtn = document.querySelector(".submit-edit");
      const formElement = document.getElementById("todoFormID");
      const inputElement = document.querySelector(".form-control");
      const ulElement = document.getElementById("todo-list");
      const checkboxElement = document.querySelector(".form-check-input");

      submitEditBtn.style.display = "inline-block";

      if (formElement && inputElement) {
        inputElement.focus();
        inputElement.value = todoElement.title;
        if (todoElement.status == "completed") checkboxElement.checked = true;
        else checkboxElement.checked = false;

        const handleEditSubmit = function (e) {
          const titleElement = ulElement.querySelector(
            `.todo_title[data-id="${index}"]`
          );
          const newValue = inputElement.value;
          todoElement.title = newValue;
          if (checkboxElement.checked) todoElement.status = "completed";
          else todoElement.status = "pending";
          localStorage.setItem("todo-list", JSON.stringify(todoList));
          titleElement.innerText = newValue;
          if (todoElement.status === "completed") {
            finishButton.classList.add("btn-dark");
            finishButton.textContent = "Reset";
            divElement.classList.add("alert-success");
          } else {
            finishButton.classList.remove("btn-dark");
            finishButton.textContent = "Finish";
            divElement.classList.remove("alert-success");
          }
          submitEditBtn.style.display = "none";
          formElement.reset();

          // Remove event listener to prevent adding multiple listeners
          submitEditBtn.removeEventListener("click", handleEditSubmit);
        };

        submitEditBtn.addEventListener("click", handleEditSubmit);
      }
    });
  }

  return liElement;
}

function createTodoList(todoList, todoListID) {
  const ulElement = document.getElementById(todoListID);
  if (ulElement) {
    if (!Array.isArray(todoList) || todoList.length === 0) return null;
    for (var todo of todoList) {
      const liElement = createTodoLi(todo);
      ulElement.appendChild(liElement);
    }
  }
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todo-list"));
  } catch {
    return [];
  }
}

function handleFormSubmit(e) {
  // Prevent form submission
  e.preventDefault();

  // Select input, ul and checkbox element of html
  const inputElement = document.querySelector(".form-control");
  const ulElement = document.getElementById("todo-list");
  const checkboxElement = document.querySelector(".form-check-input");

  // Handle submit event
  if (inputElement) {
    const inputValue = inputElement.value;
    if (inputValue) {
      const todoList = getTodoList();
      const newTodo = {
        id: todoList.length + 1,
        title: inputValue,
        status: checkboxElement.checked ? "completed" : "pending",
      };
      todoList.push(newTodo);
      localStorage.setItem("todo-list", JSON.stringify(todoList));
      const liElement = createTodoLi(newTodo);
      ulElement.appendChild(liElement);
      inputElement.value = "";
    }
  }
}

(() => {
  const todoList = getTodoList();

  // Handle form action
  const formElement = document.getElementById("todoFormID");
  if (formElement) {
    formElement.onsubmit = handleFormSubmit;
  }

  createTodoList(todoList, "todo-list");
})();
