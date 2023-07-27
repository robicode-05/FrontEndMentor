const template = document.createElement('template');
template.innerHTML = `
<style>
  .message-card {
    display: flex;
    border: 1px solid black;
    gap: 1rem;
  }

  .like-button {
    display: flex;
    flex-direction: column;
  }

  .message-content { 
    display: flex;
    flex-direction: column;
  }

  .header { 
    display: flex;
    background-color: red;
    justify-content: space-between;
  }

  .like-button {
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .replies {
    margin-top: 1rem;
    padding-left: 3rem;
    margin-left: 3rem;
    border-left: 1px solid black;
  }

  .tag {
    background-color: blue;
    color: white;
    display: none;
  }

  .user-own-message .tag {
    display: inline;
  }
  .action_edit { display: none; }
  .user-own-message .action_edit { display: inline; }
  .action_delete { display: none; }
  .user-own-message .action_delete { display: inline; }
  .user-own-message .action_reply { display: none; }

</style>

<div class="history">
  <div class="message-card">
    <div class="like-button">
      <button class="action_plus">+</button>
      <span>0</span>
      <button class="action_minus">-</button>
    </div>
    <div class="message-content">
      <div class="header">
        <div class="left">
          <span class="user-name"></span>
          <span class="tag">you</span>
          <span class="message-date"></span>
        </div>
        <div class="right">
          <button class="action_delete">Delete</button>
          <button class="action_edit">Edit</button>
          <button class="action_reply">Reply</button>
        </div>
      </div>
      <p><slot name="content"/></p>    
    </div>
  </div>

  <div class="replies">
    <slot name="reply" />
  </div>
</div>`;

class EmployeeCard extends HTMLElement {
  static get observedAttributes() { return ["id", "author", "own", "created", "score"]; }

  constructor(){
    super();
    this.attachShadow({ mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._id = this.getAttribute('id');
    this._author = this.getAttribute('author');
    this._own = this.getAttribute('own');
    this._created = this.getAttribute('created');
    this._score = this.getAttribute('score');

    // Events
    this.incrementEvent = new CustomEvent("vote-plus", {
      bubbles: false,
      cancelable: false,
      composed: true,
      detail: { id: this.id, },
    });
    this.decrementEvent = new CustomEvent("vote-minus", {
      bubbles: false,
      cancelable: false,
      composed: true,
      detail: { id: this.id, },
    });
    this.deleteEvent = new CustomEvent("delete", {
      bubbles: false,
      cancelable: false,
      composed: true,
      detail: { id: this.id, },
    });
    this.editEvent = new CustomEvent("edit", {
      bubbles: false,
      cancelable: false,
      composed: true,
      detail: { id: this.id, },
    });
    this.replyEvent = new CustomEvent("reply", {
      bubbles: false,
      cancelable: false,
      composed: true,
      detail: { id: this.id, },
    });
  } 

  attributeChangedCallback(attr, oldVal, newVal) {
  if (oldVal != newVal) {
    // Only set this value if it is different
      this[attr] = newVal; // Call the setter
    }
  }

  connectedCallback(){
    this.shadowRoot.querySelector('.message-card').setAttribute("id", this._id);
    this.shadowRoot.querySelector('span.user-name').innerText = this._author;
    if (this._own) this.shadowRoot.querySelector('.message-card').classList.add("user-own-message");
    this.shadowRoot.querySelector('span.message-date').innerText = this._created;
    this.shadowRoot.querySelector('.like-button span').innerText = this._score;

    // Custom Event
    this.shadowRoot.querySelector('button.action_plus')?.addEventListener("click", () => this.shadowRoot.dispatchEvent(this.incrementEvent));
    this.shadowRoot.querySelector('button.action_minus')?.addEventListener("click", () => this.shadowRoot.dispatchEvent(this.decrementEvent));
    if (this._own) {
      this.shadowRoot.querySelector('button.action_delete')?.addEventListener("click", () => this.shadowRoot.dispatchEvent(this.deleteEvent));
      this.shadowRoot.querySelector('button.action_edit')?.addEventListener("click", () => this.shadowRoot.dispatchEvent(this.editEvent));
    }
    else this.shadowRoot.querySelector('button.action_reply')?.addEventListener("click", () => this.shadowRoot.dispatchEvent(this.replyEvent));
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('button.action_plus')?.removeEventListener("click", () => this.shadowRoot.dispatchEvent(this.incrementEvent));
    this.shadowRoot.querySelector('button.action_minus')?.removeEventListener("click", () => this.shadowRoot.dispatchEvent(this.decrementEvent));
    if (this._own) {
      this.shadowRoot.querySelector('button.action_delete')?.removeEventListener("click", () => this.shadowRoot.dispatchEvent(this.deleteEvent));
      this.shadowRoot.querySelector('button.action_edit')?.removeEventListener("click", () => this.shadowRoot.dispatchEvent(this.editEvent));
    }
    else this.shadowRoot.querySelector('button.action_reply')?.removeEventListener("click", () => this.shadowRoot.dispatchEvent(this.replyEvent));
  }

  get id() {
    return this._id;
  }
    
  set id(value) {
    if (value !== this._id) {
      this._id = value;
      if (value !== null) this.shadowRoot.querySelector('.message-card').setAttribute("id", this._id);
      else this.shadowRoot.querySelector('.message-card').removeAttribute("id");
    }
  }

  get own() {
    return this._own;
  }
    
  set own(value) {
    console.log("set own");
    if (value !== this._own) {
      this._own = value;
      if (value !== null) this.shadowRoot.querySelector('.message-card').classList.add("user-own-message");
      else this.shadowRoot.querySelector('.message-card').classList.remove("user-own-message");
    }
  }

  get author() {
    return this._author;
  }
    
  set author(value) {
    if (value !== this._author) {
      this._author = value;
      if (value !== null) this.shadowRoot.querySelector('span.user-name').innerText = this._author;
      else this.shadowRoot.querySelector('h3').innerText = "";
    }
  }

  get created() {
    return this._created;
  }
    
  set created(value) {
    if (value !== this._created) {
      this._created = value;
      if (value !== null) this.shadowRoot.querySelector('span.message-date').innerText = this._created;
      else this.shadowRoot.querySelector('span.message-date').innerText = "";
    }
  }

  
  get score() {
    return this._score;
  }
    
  set score(value) {
    if (value !== this._score) {
      this._score = value;
      if (value !== null) this.shadowRoot.querySelector('.like-button span').innerText = this._score;
      else this.shadowRoot.querySelector('.like-button span').innerText = "";
    }
  }
}


window.customElements.define('message-card', EmployeeCard);