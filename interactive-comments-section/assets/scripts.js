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
  console.log("getCurrentUserData");
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
    console.log("createMessageCardComponent", messageCardComponent);
    main.appendChild(messageCardComponent); 
    console.log("appenc main", main);
  }
}


/**
 * @param {Comment} comment
 */
function createMessageCardComponent(comment) {
  const messageCardComponent = document.createElement("message-card");
  messageCardComponent.setAttribute("author", comment.user.username)
  return messageCardComponent;
}