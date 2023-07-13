// Variables

let mode = document.querySelector("header img");
let form = document.querySelector("main form");
let input = document.querySelector("main form input");
let list = document.querySelector(".main ul");
let itmLeft = document.querySelector(".main .controls .left span");
let filter = document.querySelector("main .filter");
let filters = document.querySelectorAll("main .filter span");
let allFilt = document.querySelector(".main .filter .all");
let activFilt = document.querySelector(".main .filter .active");
let compFilt = document.querySelector(".main .filter .complete");
let clearBtn = document.querySelector("main .clear");
let tip = document.querySelector("main .tip");

// Light/Dark Mode

mode.onclick = () => {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    mode.src = "images/icon-moon.svg";
  } else {
    mode.src = "images/icon-sun.svg";
  }
};

// Media Query

function myFunction(x) {
  if (x.matches) {
    tip.before(filter);
  } else {
    clearBtn.before(filter);
  }
}

let x = window.matchMedia("(max-width: 560px)");
myFunction(x);
x.addEventListener("change", myFunction);

// Events

form.onsubmit = () => {
  if (input.value != "") createTask(input.value);
  input.value = "";
  return false;
};

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) delTask(e.target.parentElement);
  localStorage.setItem("tasks", list.innerHTML);
});

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("check")) {
    if (e.target.parentElement.classList.contains("completed")) {
      ++itmLeft.innerHTML;
      e.target.parentElement.classList.remove("completed");
      let completes = document.querySelectorAll(".main ul .completed");
      completes.forEach((e) => list.prepend(e));
    } else {
      list.prepend(e.target.parentElement);
      e.target.parentElement.classList.add("completed");
      --itmLeft.innerHTML;
    }
    localStorage.setItem("tasks", list.innerHTML);
  }
});

clearBtn.onclick = () => {
  let completes = document.querySelectorAll(".main ul .completed");
  completes.forEach((e) => delTask(e));
  localStorage.setItem("tasks", list.innerHTML);
};

filters.forEach((el) => {
  el.onclick = () => sort(el);
});

if (localStorage.getItem("tasks")) {
  list.innerHTML = localStorage.getItem("tasks");
  itmLeft.innerHTML = document.querySelectorAll(
    ".main ul > :not(.completed)"
  ).length;
  draganddrop();
}

// Functions

function createTask(value) {
  let item = document.createElement("li");
  let circle = document.createElement("div");
  let task = document.createElement("span");
  let delbtn = document.createElement("img");
  let taskInput = document.createTextNode(value);
  task.appendChild(taskInput);
  circle.className = "check";
  delbtn.className = "delete";
  delbtn.src = "images/icon-cross.svg";
  item.append(circle, task, delbtn);
  list.appendChild(item);
  item.setAttribute("draggable", "true");
  ++itmLeft.innerHTML;
  localStorage.setItem("tasks", list.innerHTML);
  draganddrop();
}

function delTask(el) {
  el.remove();
  if (el.classList.contains("completed") == false) {
    --itmLeft.innerHTML;
  }
  localStorage.setItem("tasks", list.innerHTML);
}

function sort(ele) {
  if (list.children) {
    let tasks = Array.from(list.children);
    tasks.forEach((task) => (task.style.display = "none"));
    filters.forEach((f) => f.classList.remove("select"));
    ele.classList.add("select");
    if (ele.classList.contains("all")) {
      tasks.forEach((task) => (task.style.display = "flex"));
    } else if (ele.classList.contains("active")) {
      tasks.forEach((task) => {
        if (task.classList.contains("completed") === false) {
          task.style.display = "flex";
        }
      });
    } else if (ele.classList.contains("complete")) {
      tasks.forEach((task) => {
        if (task.classList.contains("completed")) task.style.display = "flex";
      });
    }
  }
  localStorage.setItem("tasks", list.innerHTML);
}

function draganddrop() {
  const draggables = document.querySelectorAll(".main ul li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      list.appendChild(draggable);
    } else {
      list.insertBefore(draggable, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll("ul li:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}
