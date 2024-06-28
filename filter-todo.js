// Handle push state URL
function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, "", url);
}

function handleFilterValue(selectElement) {
  const ulElement = document.getElementById("todo-list");
  const liElements = Array.from(ulElement.querySelectorAll("li"));

  selectElement.addEventListener("change", function (e) {
    e.stopPropagation();
    const selectValue = e.target.value;
    if (selectValue == 1) {
      handleFilterChange("status", "pending");
      liElements.forEach((liElement) => {
        if (liElement.dataset.status === "pending") liElement.hidden = false;
        else liElement.hidden = true;
      });
    } else if (selectValue == 2) {
      handleFilterChange("status", "completed");
      liElements.forEach((liElement) => {
        if (liElement.dataset.status === "completed") liElement.hidden = false;
        else liElement.hidden = true;
      });
    } else {
      handleFilterChange("status", "all");
      liElements.forEach((liElement) => {
        liElement.hidden = false;
      });
    }
  });
}

function initFilterInput() {
  const selectElement = document.getElementById("selectFilter");
  if (!selectElement) return;

  handleFilterValue(selectElement);
}

(() => {
  initFilterInput();
})();
