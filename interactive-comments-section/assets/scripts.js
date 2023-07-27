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

/**
 * Map with username and commentIds
 * @type { Map<string, string[]> } 
 */
const votes = new Map();

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value],
    };
  } else return value;
}

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

window.onload = async function() { 
  await retrieveStoredData();
  renderMessages();
}

async function retrieveStoredData() {  
  const response = await fetch("assets/data.json");
  const data = await response.json();

  currentUser = new User(data.currentUser);  
  
  // check if datas are stored are already stored locally
  const commentsStorage = localStorage.getItem("commentsStorage");
  if (commentsStorage === null) {
    for (const comment of data.comments) {
      comments.push(new Comment(comment));
      for (const reply of comment.replies) {
        comments.push(new Comment(reply, comment.id));
      }
    }
    localStorage.setItem("commentsStorage", JSON.stringify(comments));
  } 
  else comments = JSON.parse(localStorage.getItem("commentsStorage"));

  const votesStorage = localStorage.getItem("votesStorage");
  if (votesStorage === null) {
    localStorage.setItem("votesStorage", JSON.stringify(votes, replacer));
  } 
  else {
    const storedVotes = JSON.parse(localStorage.getItem("votesStorage"), reviver);
    for (const [storedStoredEntryName, storedStoredEntryVotes] of storedVotes.entries()) {
      votes.set(storedStoredEntryName, storedStoredEntryVotes);
    }
  }
}

function saveDatas() {
  localStorage.setItem("commentsStorage", JSON.stringify(comments));
  localStorage.setItem("votesStorage", JSON.stringify(votes, replacer));
}

function renderMessages() {
  const main = document.querySelector("body main");

  for (const comment of comments.filter((c) => c.parentId === undefined)) {
    const messageCardComponent = createMessageCardComponent(comment);
    main.appendChild(messageCardComponent); 
  }
}


function updateMessageRender(id, attr, value) {
  const messageToUpdate = document.querySelector(`#message-card-${id}`);
  if (messageToUpdate === null) return;

  messageToUpdate.setAttribute(attr, value);
}


/**
 * @param {Comment} comment
 */
function createMessageCardComponent(comment) {
  const messageCardComponent = document.createElement("message-card");

  // Setting up attribute
  messageCardComponent.setAttribute("id", `message-card-${comment.id}`);
  messageCardComponent.setAttribute("author", comment.user.username);
  if (comment.user.username === currentUser.username)  messageCardComponent.setAttribute("own", true);
  messageCardComponent.setAttribute("created", comment.createdAt);
  messageCardComponent.setAttribute("score", comment.score);

  // Setting up slots
  messageCardComponent.appendChild(createMessageContent(comment));
  if (comments.some((c) => c.parentId === comment.id)) {
    const replySlot = document.createElement("div");
    replySlot.setAttribute("slot", "reply");
    for (const reply of comments.filter((c) => c.parentId === comment.id)) {
      const replyCardComponent = createMessageCardComponent(reply);
      replySlot.appendChild(replyCardComponent);
    }
    messageCardComponent.appendChild(replySlot);
  }

  // Setting up events
  messageCardComponent.addEventListener("vote-plus", (e) => incrementScoreEventHandler(e, comment.id));
  messageCardComponent.addEventListener("vote-minus", (e) => decrementScoreEventHandler(e, comment.id));
  messageCardComponent.addEventListener("delete", (e) => deleteEventHandler(e, comment.id));
  messageCardComponent.addEventListener("edit", (e) => editEventHandler(e));
  messageCardComponent.addEventListener("reply", (e) => replyEventHandler(e));

  return messageCardComponent;
}

/**
 * @param {Comment} comment
 * @param {"reader" | "editor"} mode
 */
function createMessageContent(comment, mode) {
  const messageContent = document.createElement("p");
  messageContent.setAttribute("slot", "content");
  messageContent.textContent = comment.content;

  return messageContent;
}



/**
 * @param {Comment[]} commentsSrc
 * @param {string} id
 * @returns {Comment | undefined}
 */
function findCommentFromId(commentsSrc, id) {
  if (commentsSrc.some((c) => c.id === id)) return commentsSrc.find((c) => c.id === id);
  for (const comment of commentsSrc) {
    const potential = findCommentFromId(comment.replies, id);
    if (potential !== undefined) return potential;
  }
}

function userVoteBuilder(commentId, isPositive) {
  return `votedForComment_${commentId}_VoteIs_${isPositive ? 'PLUS' : 'MINUS' }`;
}

function registerUserVote(username, commentId, isPositive) {
  const userVote =  userVoteBuilder(commentId, isPositive);
  const isUserRegistered = votes.has(username);
  if (!isUserRegistered) {
    votes.set(username, [userVote]);
    return;
  }

  const doesUserHaveAlreadyAVoteForThisComment = votes.get(username).includes(userVote);
  if (doesUserHaveAlreadyAVoteForThisComment) return;
  votes.get(username).push(userVote);
}

function eraseUserVote(username, commentId, isPositive) {
  const userVote = userVoteBuilder(commentId, isPositive);
  if (!votes.has(username)) return;
  const old = votes.get(username);
  votes.get(username).splice(0);
  votes.get(username).push(...old);
}

function checkIfUserCanVote(username, commentId, isPositive) {
  const userVote = userVoteBuilder(commentId, isPositive);
  const isUserRegistered = votes.has(username);
  if (!isUserRegistered) return true;

  const doesUserHaveAlreadyAVoteForThisComment = votes.get(username).includes(userVote);
  if (doesUserHaveAlreadyAVoteForThisComment) return false;

  return true;
}

// Event handler 
function incrementScoreEventHandler(e, id) {
  const commentToIncrement = findCommentFromId(comments, id);
  if (commentToIncrement === undefined) return;
  // Prevent multiple votes from same user
  if (!checkIfUserCanVote(currentUser.username, id, true)) return;
  
  // Check if the user previously vote for the other option
  // If it did => erase the old vote
  if (!checkIfUserCanVote(currentUser.username, id, false)) {
    eraseUserVote(currentUser.username, id, false);
    commentToIncrement.score++;
  }

  // User cannot update its own comment
  if (commentToIncrement.user.username === currentUser.username) return;

  commentToIncrement.score++;
  updateMessageRender(id, "score", commentToIncrement.score);
  registerUserVote(currentUser.username, commentToIncrement.id, true);
  saveDatas();
}

function decrementScoreEventHandler(e, id) {
  const commentToIncrement = findCommentFromId(comments, id);
  if (commentToIncrement === undefined) return;
   // Prevent multiple votes from same user
   if (!checkIfUserCanVote(currentUser.username, id, false)) return;

    // Check if the user previously vote for the other option
  // If it did => erase the old vote
  if (!checkIfUserCanVote(currentUser.username, id, true)) {
    eraseUserVote(currentUser.username, id, true);
    commentToIncrement.score--;
  }
  
  
  // User cannot update its own comment
  if (commentToIncrement.user.username === currentUser.username) return;
  
  commentToIncrement.score--;
  updateMessageRender(id, "score", commentToIncrement.score);
  registerUserVote(currentUser.username, commentToIncrement.id, false);
  saveDatas();
}


function deleteEventHandler(e, id) {
  console.log("deleteEventHandler", e);

  const indexToRemove = comments.findIndex((c) => c.id === id);
  if (indexToRemove < 0) return;

  comments.splice(indexToRemove, 1);
  saveDatas();
  document.querySelector(`#message-card-${id}`)?.remove();

}
function editEventHandler(e) {
  console.log("editEventHandler", e);
}
function replyEventHandler(e) {
  console.log("replyEventHandler", e);
}