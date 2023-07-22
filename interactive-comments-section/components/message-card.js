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

</style>

<div class="message-card">
  <div class="like-button">
    <button>+</button>
    <span>number</span>
    <button>-</button>
  </div>
  <div class="message-content">
    <div class="header">
      <div class="left">
        <span class="user-name"></span>
        <span class="message-date"></span>
      </div>
      <div class="right">
        <button>Delete</button>
        <button>Reply</button>
      </div>
    </div>
    <p><slot name="content"/></p>    
  </div>
</div>`;

class EmployeeCard extends HTMLElement{
  static get observedAttributes() { return ["author", "created"]; }

  constructor(){
    super();
    this.attachShadow({ mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._id = this.getAttribute('id');
    this._author = this.getAttribute('author');
    this._own = this.getAttribute('own');
    this._created = this.getAttribute('created');
    this._score = this.getAttribute('score');
  } 

  attributeChangedCallback(attr, oldVal, newVal) {
    console.log("attributeChangedCallback", attr, oldVal, newVal);
  if (oldVal != newVal) {
    // Only set this value if it is different
      this[attr] = newVal; // Call the setter
    }
  }

  connectedCallback(){
    this.shadowRoot.querySelector('span.user-name').innerText = this._author;
    this.shadowRoot.querySelector('span.message-date').innerText = this._created;
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
    console.log("created", value);
    if (value !== this._created) {
      this._created = value;
      if (value !== null) this.shadowRoot.querySelector('span.message-date').innerText = this._created;
      else this.shadowRoot.querySelector('span.message-date').innerText = "";
    }
  }
}


window.customElements.define('message-card', EmployeeCard);