const tasks = [];

// some default tasks
// if state = true => the task has been done, false => task is todo
tasks.push({id: "default_task_0", order: 0, state: true,  text: "Complete online Javascript course"});
tasks.push({id: "default_task_1", order: 1, state: false, text: "Jog around the park 3x"});
tasks.push({id: "default_task_2", order: 2, state: false, text: "10 minutes meditations"});
tasks.push({id: "default_task_3", order: 3, state: false, text: "Read for 1 hour"});
tasks.push({id: "default_task_4", order: 4, state: false, text: "Pick up groceries"});
tasks.push({id: "default_task_5", order: 5, state: false, text: "Complete Todo App on Frontend Mentor"});


generateTaskListToDisplay(); // initial drawing

/**
 * Add a new task in the list
 * @param {Event} event 
 */
function addNewTask(event) {
  tasks.push({id: crypto.randomUUID(), order: tasks.length, state: false, text: event.target.value});
  generateTaskListToDisplay();
  event.target.value = "";
}

/**
 * Switch state of task  + 
 * regenerate the display
 * @param {String} taskId 
 */
function switchTaskState(taskId) {
  const taskToSwitchState = tasks.find((t) => t.id === taskId);
  if (taskToSwitchState === undefined) return;
  
  taskToSwitchState.state = !taskToSwitchState.state;

  generateTaskListToDisplay()
}

/**
 * Remove the task from the list + 
 * regenerate the display
 * @param {String} taskId 
 */
function removeTaskFromList(taskId) {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index < 0) return;

  tasks.splice(index, 1);

  generateTaskListToDisplay();
}

/**
 * Remove all completed tasks from the list + 
 * regenerate the display
 */
function removeAllCompletedTasks() {
  for (const task of tasks.filter((t) => t.state === true)) {
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index < 0) continue;  
    tasks.splice(index, 1);
  }

  generateTaskListToDisplay();
}

/**
 * Update counter on page
 */
function updateLeftItemCounter() {
  document.querySelector("#left-item-counter").textContent = tasks.length - tasks.filter((t) => t.state).length;
}

/**
 * 
 * @param {string} id 
 * @param {MouseEvent} event 
 */
function clickEventCatcher(taskId, event) {
  // Click on delete btn
  if (event.target.className === "close-btn") {
    removeTaskFromList(taskId);
    event.preventDefault();
    return;
  }

  // Click elsewhere
  switchTaskState(taskId);
  // catch click on all container
  // we do not want the checkbox the update itself
  event.preventDefault();
}

function setFilterMode() {
  // Retrieve filter radio checkbox value
  const filter = [...document.getElementsByName("filter")].find((n) => n.checked).value;
  const listParent = document.querySelector("ul");
  listParent.className = filter;
}

/**
 * Generate the task list from a filter +
 * Update tasksTodoCounter
 * @param {"all" | "active" | "completed"} filter 
 * @returns 
 */
function generateTaskListToDisplay() {
  // inset tasks in DOM
  const listParent = document.querySelector("ul");

  // Clean list before pushing new nodes
  // TODO : Create a better algorithm to delete et insert only the ones needed
  while (listParent.firstChild) {
    listParent.removeChild(listParent.firstChild);
  }

  // for (const task of tasks) {
    for (const task of tasks.sort((reference, comparison) => reference.order - comparison.order)) {
    const listItem = document.createElement("li");
    listItem.setAttribute("id", task.id);
    listItem.onclick = (event) => clickEventCatcher(task.id, event);
    listItem.draggable = true;
    listItem.ondragstart = dragstart_handler;
    listItem.ondragover = dragover_handler;
    listItem.ondrag = (event) => throttledDragEvent(task.id, event);

    // Create state checkbox
    const listItemCheckbox = document.createElement("input");
    listItemCheckbox.setAttribute("title", "Mark task as completed");
    listItemCheckbox.setAttribute("type", "checkbox");
    listItemCheckbox.setAttribute("id", `${task.id}_checkbox_input`);
    if (task.state) { 
      listItem.className = "completed";
      listItemCheckbox.setAttribute("checked", "");
    }
    // Create text for task
    const listItemName = document.createElement("label");
    listItemName.setAttribute("for", `${task.id}_checkbox_input`);
    listItemName.textContent = task.text;

    // Create the close button
    const listItemCloseButton = document.createElement("button");
    listItemCloseButton.setAttribute("aria-label", "Button to remove a task from todo list")
    listItemCloseButton.setAttribute("class", "close-btn");
    listItemCloseButton.setAttribute("type", "button");

    listItem.appendChild(listItemCheckbox);
    listItem.appendChild(listItemName);
    listItem.appendChild(listItemCloseButton);

    listParent.appendChild(listItem);
  }  
  updateLeftItemCounter();
}


/* DRAG AND DROP MANAGEMENT */

// array between task id and its y coordinate
// type: {id: string, y: number }
const tasksPositions = [];
generatePositionMap(); // Starting up drag & drop system

function generatePositionMap() {
  tasksPositions.splice(0);
  for (const task of tasks) {
    // get vertical coordinate
    const taskCLientBound = document.querySelector(`li#${task.id}`).getClientRects()[0];
    // We detect the change when the cursor reach the half of its neighbour
    const position = taskCLientBound.y + (taskCLientBound.height / 2);
    tasksPositions.push({id: task.id, y: position});
  }
}

function swap(idA, idB) {
  const aIndex = tasks.findIndex((t) => t.id === idA);
  const bIndex = tasks.findIndex((t) => t.id == idB);

  if (aIndex < 0 || bIndex < 0) return;
  if (Math.abs(tasks[aIndex].order - tasks[bIndex].order) > 1) return;

  const oldAOrder = tasks[aIndex].order;
  tasks[aIndex].order = tasks[bIndex].order;
  tasks[bIndex].order = oldAOrder;
}

/**
 * Throttle  
 * @param {Function} func 
 * @param {number} duration 
 * @returns 
 */
function throttle(func, duration = 300) {
  let shouldWait = false

  return function (...args) {
    if (!shouldWait) {
      func.apply(this, args)
      shouldWait = true

      setTimeout(function () {
        shouldWait = false
      }, duration)
    }
  }
}

const throttledDragEvent = throttle(drag, 16);

/**
 * 
 * @param {DragEvent} event 
 */
function dragstart_handler(event) {
  event.dataTransfer.dropEffect = "move";
}

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

/**
 * 
 * @param {string} taskId 
 * @param {DragEvent} event 
 */
function drag(taskId, event) {
  const taskCLientBound = document.querySelector(`li#${taskId}`).getClientRects()[0];
  // We detect the change when the cursor reach the half of its neighbour
  const startingPosition = taskCLientBound.y + (taskCLientBound.height / 2);
  const currentPosition = event.y;

  const delta = startingPosition - currentPosition;

  const crossedTasks = (delta < 0) ?
    tasksPositions.filter((t) => t.y > startingPosition && t.y < currentPosition) :
    tasksPositions.filter((t) => t.y < startingPosition && t.y > currentPosition);

  if (crossedTasks.length < 1) return; // did not pass any other task

  // for each crossed tasks, reorder for better animation
  // we could redraw the list only when all the swap are done for better performance
  for (const newlyABoveTask of crossedTasks) {
    swap(taskId, newlyABoveTask.id);
    generatePositionMap();
    generateTaskListToDisplay();
  }
}