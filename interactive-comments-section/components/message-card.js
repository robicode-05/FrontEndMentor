const template = document.createElement('template');
template.innerHTML = `
<style>
  .message-card {
    background-color: red;
    color: white;
    width: 250px;
    height: 100px;
  }

</style>
<div class="message-card">
  <div>
    <h3></h3>
    <p><slot name="text" />
  </div>
</div>`;

class EmployeeCard extends HTMLElement{
  static get observedAttributes() { return ['author']; }

 constructor(){
     super();
     this.attachShadow({ mode: 'open'});
     this.shadowRoot.appendChild(template.content.cloneNode(true));
     this._author = this.getAttribute('author');
 } 

 attributeChangedCallback(attr, oldVal, newVal) {
  if (attr === "author") {
    if (oldVal != newVal) {
      // Only set this value if it is different
        this.author = newVal; // Call the setter
      }
    }
  }

  connectedCallback(){
    this.shadowRoot.querySelector('h3').innerText = this._author;
  }

  get author() {
    return this._author; // Return the internal value
  }
    
  set author(value) {
    // Only run this if the new value is different from the internal value
    if (value !== this._author) {
      console.log(`set author ${value}`);
      this._author = value; // Set the internal value
      // If you want the filter property to always show
      // in the attributes then do this:
      if (value !== null) {
          this.shadowRoot.querySelector('h3').innerText = this._author;
      } else {
          this.shadowRoot.querySelector('h3').innerText = "";
      }
    }
  }
}


window.customElements.define('message-card', EmployeeCard);