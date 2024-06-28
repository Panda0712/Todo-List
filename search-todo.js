const ulElement = document.getElementById("todo-list");
const liElements = ulElement.querySelectorAll("li");

// Handle push state URL
function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, "", url);
}

// Handle each li element
function isMatch(element, value) {
  const textElement = element.querySelector(".todo_title");
  const textElementValue = textElement.innerText;
  if (textElementValue.toLowerCase().includes(value.toLowerCase())) {
    element.hidden = false;
    return;
  }
  element.hidden = true;
}

// Loop the li elements list
function handleValue(searchInputValue) {
  liElements.forEach(function (liElement) {
    isMatch(liElement, searchInputValue);
  });
}

function initSearchInput() {
  // find searchTerm input
  const searchInput = document.querySelector(".searchTerm");
  if (!searchInput) return;

  // attach events for input
  searchInput.addEventListener("input", function (e) {
    handleValue(searchInput.value);
    handleFilterChange("searchTerm", searchInput.value);
  });
}
(() => {
  initSearchInput();
})();
