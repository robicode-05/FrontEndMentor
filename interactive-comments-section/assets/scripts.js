import { Comment } from "../model/comment.js";
import { User} from "../model/user.js";

/**
 * @type { User }
 */
let currentUser;
/**
 * @type { Comment[] } 
 */
let comments = [];

window.onload = async function() { 
  await retrieveStoredData();
  renderMessages();
} 

    
async function retrieveStoredData() {
  const response = await fetch("assets/data.json");
  const data = await response.json();

  currentUser = new User(data.currentUser);    
  for (const comment of data.comments) {
      comments.push(new Comment(comment));
  }
}

function renderMessages() {
  const main = document.querySelector("body main");

  for (const comment of comments) {
    const messageCardComponent = createMessageCardComponent(comment);
    main.appendChild(messageCardComponent); 
  }
}


/**
 * @param {Comment} comment
 */
function createMessageCardComponent(comment) {
  const messageCardComponent = document.createElement("message-card");

  // Setting up attribute
  messageCardComponent.setAttribute("id", comment.id);
  messageCardComponent.setAttribute("author", comment.user.username);
  if (comment.user.username === currentUser.username)  messageCardComponent.setAttribute("own", true);
  messageCardComponent.setAttribute("created", comment.createdAt);
  messageCardComponent.setAttribute("score", comment.score);

  // Setting up slots
  messageCardComponent.appendChild(createMessageContent(comment));
  if ((comment.replies?.length ?? 0) > 0) {
    const replySlot = document.createElement("div");
    replySlot.setAttribute("slot", "reply");
    for (const reply of comment.replies) {
      const replyCardComponent = createMessageCardComponent(reply);
      replySlot.appendChild(replyCardComponent);
    }
    messageCardComponent.appendChild(replySlot);
  }

  // Setting up events
  messageCardComponent.addEventListener("vote-plus", (e) => incrementScoreEventHandler(e))
  messageCardComponent.addEventListener("vote-minus", (e) => decrementScoreEventHandler(e))
  messageCardComponent.addEventListener("delete", (e) => deleteEventHandler(e))
  messageCardComponent.addEventListener("edit", (e) => editEventHandler(e))
  messageCardComponent.addEventListener("reply", (e) => replyEventHandler(e))

  return messageCardComponent;
}

/**
 * @param {Comment} comment
 * @param {"reader" | "editor"} mode
 */
function createMessageContent(comment, mode) {
  // if (mode === "reader") {

  const messageContent = document.createElement("p");
  messageContent.setAttribute("slot", "content");
  messageContent.textContent = comment.content;

  return messageContent;
  // }
}



// Event handler 
function incrementScoreEventHandler(e) {
  console.log("incrementScoreEventHandler", e);
}
function decrementScoreEventHandler(e) {
  console.log("decrementScoreEventHandler", e);
}
function deleteEventHandler(e) {
  console.log("deleteEventHandler", e);
}
function editEventHandler(e) {
  console.log("editEventHandler", e);
}
function replyEventHandler(e) {
  console.log("replyEventHandler", e);
}