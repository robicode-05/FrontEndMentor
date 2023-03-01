const tasks = [];
let tasksTodoCounter = 0;

// some default tasks
// if state = true => the task has been done, false => task is todo
tasks.push({id: "default_task_0", state: true, text: "Complete online Javascript course"});
tasks.push({id: "default_task_1", state: false, text: "Jog around the park 3x"});
tasks.push({id: "default_task_2", state: false, text: "10 minutes meditations"});
tasks.push({id: "default_task_3", state: false, text: "Read for 1 hour"});
tasks.push({id: "default_task_4", state: false, text: "Pick up groceries"});
tasks.push({id: "default_task_5", state: false, text: "Complete Todo App on Frontend Mentor"});


function addNewTask(text) {
  tasks.push({id: crypto.randomUUID(), state: false, text})
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
    removeTaskFromList(task);
  }

  generateTaskListToDisplay();
}

/**
 * Generate the task list from a filter +
 * Update tasksTodoCounter
 * @param {"all" | "active" | "completed"} filter 
 * @returns 
 */
function generateTaskListToDisplay(filter = "all") {
  let tasksToDisplay = [];

  if (filter === "all") tasksToDisplay = tasks;
  if (filter === "active") tasksToDisplay = tasks.filter((t) => t.state === false);
  if (filter === "completed") tasksToDisplay = tasks.filter((t) => t.state === true);

  // inset tasks in DOM
  
  tasksTodoCounter = tasks.length - tasksToDisplay.length;
}