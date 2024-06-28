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
      if (todoList1[index1 - 1].status === "pending") {
        liElement.dataset.status = "completed";
        todoList1[index1 - 1].status = "completed";
        finishButton.classList.add("btn-dark");
        finishButton.textContent = "Reset";
        divElement.classList.add("alert-success");
      } else {
        liElement.dataset.status = "pending";
        todoList1[index1 - 1].status = "pending";
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
    editButton.addEventListener("click", function () {
      const todoList = getTodoList();
      const index = todo.id;
      const submitEditBtn = document.querySelector(".submit-edit");
      const formElement = document.getElementById("todoFormID");
      const inputElement = document.querySelector(".form-control");

      if (formElement && inputElement) {
        formElement.dataset.id = todo.id; // Set dataset.id for edit mode
        inputElement.focus();
        inputElement.value = todoList[index - 1].title;
        submitEditBtn.style.display = "inline-block";
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
    return JSON.parse(localStorage.getItem("todo-list")) || [];
  } catch {
    return [];
  }
}

function handleFormSubmit(e) {
  // Prevent form submission
  e.preventDefault();

  // Select input and ul element of html
  const inputElement = document.querySelector(".form-control");
  const ulElement = document.getElementById("todo-list");
  const formElement = document.getElementById("todoFormID");

  // Handle submit event
  if (inputElement) {
    const inputValue = inputElement.value;
    if (inputValue) {
      const todoList = getTodoList();
      if (formElement.dataset.id) {
        // Edit mode
        const todoId = parseInt(formElement.dataset.id);
        const todoIndex = todoList.findIndex((todo) => todo.id === todoId);
        if (todoIndex > -1) {
          todoList[todoIndex].title = inputValue;
          localStorage.setItem("todo-list", JSON.stringify(todoList));
          const titleElement = ulElement.querySelector(
            `.todo_title[data-id="${todoId}"]`
          );
          titleElement.innerText = inputValue;
          formElement.removeAttribute("data-id");
        }
      } else {
        // Add mode
        const newTodo = {
          id: todoList.length + 1,
          title: inputValue,
          status: "pending",
        };
        todoList.push(newTodo);
        localStorage.setItem("todo-list", JSON.stringify(todoList));
        const liElement = createTodoLi(newTodo);
        ulElement.appendChild(liElement);
      }
      inputElement.value = "";
      document.querySelector(".submit-edit").style.display = "none";
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
