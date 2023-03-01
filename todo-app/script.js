const tasks = [];

// some default tasks
// if state = true => the task has been done, false => task is todo
tasks.push({id: "default_task_0", state: true,  text: "Complete online Javascript course"});
tasks.push({id: "default_task_1", state: false, text: "Jog around the park 3x"});
tasks.push({id: "default_task_2", state: false, text: "10 minutes meditations"});
tasks.push({id: "default_task_3", state: false, text: "Read for 1 hour"});
tasks.push({id: "default_task_4", state: false, text: "Pick up groceries"});
tasks.push({id: "default_task_5", state: false, text: "Complete Todo App on Frontend Mentor"});


generateTaskListToDisplay(); // initial drawing

/**
 * Add a new task in the list
 * @param {Event} event 
 */
function addNewTask(event) {
  tasks.push({id: crypto.randomUUID(), state: false, text: event.target.value});
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
  // TODO : Create a better algorithm to delete et insert only the one needed
  while (listParent.firstChild) {
    listParent.removeChild(listParent.firstChild);
  }

  for (const task of tasks) {
    const listItem = document.createElement("li");
    listItem.setAttribute("id", task.id);
    listItem.onclick = (event) => clickEventCatcher(task.id, event);

    // Create state checkbox
    const listItemCheckbox = document.createElement("input");
    listItemCheckbox.setAttribute("title", "Task check state");
    listItemCheckbox.setAttribute("type", "checkbox");
    if (task.state) { 
      listItem.className = "completed";
      listItemCheckbox.setAttribute("checked", "");
    }
    // Create text for task
    const listItemName = document.createElement("span");
    listItemName.textContent = task.text;

    // Create the close button
    const listItemCloseButton = document.createElement("button");
    listItemCloseButton.setAttribute("aria-label", "Button to remove a task from todo list")
    listItemCloseButton.setAttribute("class", "close-btn");
    listItemCloseButton.setAttribute("type", "button");

    listItem.appendChild(listItemCheckbox);
    listItem.appendChild(listItemName);
    listItem.appendChild(listItemCloseButton);
    // listItem.appendChild(listItemContainer);

    listParent.appendChild(listItem);
  }  
  updateLeftItemCounter();
}
