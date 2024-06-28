// Handle each li element for search task
function isMatchSearch(element, value) {
  const textElement = element.querySelector(".todo_title");
  const textElementValue = textElement.innerText.toLowerCase();
  return textElementValue.includes(value.toLowerCase());
}

// isMatch function for filter task
function isMatchStatus(liElement, filterStatus) {
  return filterStatus === "all" || liElement.dataset.status === filterStatus;
}

function isMatch(element, params) {
  const searchTerm = params.get("searchTerm") || "";
  const filterStatus = params.get("status") || "all";
  return (
    isMatchSearch(element, searchTerm) && isMatchStatus(element, filterStatus)
  );
}

// Handle push state URL
function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, "", url);

  const ulElement = document.getElementById("todo-list");
  const liElements = Array.from(ulElement.querySelectorAll("li"));

  liElements.forEach((liElement) => {
    const needToShow = isMatch(liElement, url.searchParams);
    liElement.hidden = !needToShow;
  });
}

// Handle for search task
function handleValue(searchInputValue) {
  const ulElement = document.getElementById("todo-list");
  const liElements = Array.from(ulElement.querySelectorAll("li"));

  liElements.forEach((liElement) => {
    const textElement = liElement.querySelector(".todo_title");
    const textElementValue = textElement.innerText.toLowerCase();
    if (textElementValue.includes(searchInputValue.toLowerCase())) {
      liElement.hidden = false;
    } else liElement.hidden = true;
  });
  handleFilterChange("searchTerm", searchInputValue);
}

// Handle for filter task
function handleFilterValue(selectElement) {
  selectElement.addEventListener("change", function (e) {
    e.stopPropagation();
    const selectValue = e.target.value;
    if (selectValue == "1") {
      handleFilterChange("status", "pending");
    } else if (selectValue == "2") {
      handleFilterChange("status", "completed");
    } else {
      handleFilterChange("status", "all");
    }
  });
}

// Init for filter task
function initFilterInput(params) {
  const selectElement = document.getElementById("selectFilter");
  if (!selectElement) return;

  if (params.get("status")) {
    selectElement.value = params.get("status");
  }

  handleFilterValue(selectElement);
}

// Init for search task
function initSearchInput(params) {
  // find searchTerm input
  const searchInput = document.querySelector(".searchTerm");
  if (!searchInput) return;

  if (params.get("searchTerm")) {
    searchInput.value = params.get("searchTerm");
  }

  // attach events for input
  searchInput.addEventListener("input", function (e) {
    handleValue(searchInput.value);
  });
}
(() => {
  const params = new URLSearchParams(window.location.search);
  initSearchInput(params);
  initFilterInput(params);

  // Lấy các phần tử li và ẩn/hiện dựa trên query params ban đầu
  const url = new URL(window.location);
  const ulElement = document.getElementById("todo-list");
  const liElements = Array.from(ulElement.querySelectorAll("li"));

  liElements.forEach((liElement) => {
    const needToShow = isMatch(liElement, url.searchParams);
    liElement.hidden = !needToShow;
  });
})();
