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
  messageCardComponent.setAttribute("author", comment.user.username);
  messageCardComponent.setAttribute("created", comment.createdAt);
  messageCardComponent.appendChild(createMessageContent(comment));
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