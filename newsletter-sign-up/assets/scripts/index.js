function handleEnterKey(e) {
  if( e.key !== 'Enter') return;
  e.preventDefault();
  retrieveEmail();
}

function retrieveEmail() {
  const userEmail = document.querySelector("#newsletter-email input").value;
  const isEmailValid = validateEmail(userEmail);
  if (!isEmailValid)  {
    document.querySelector("#newsletter-email").classList.add("error");
    return;
  }
  
  document.querySelector("#newsletter-email").classList.remove("error");
  // document.querySelector("dialog").setAttribute("open", "");
  document.querySelector("dialog").open = true;
  document.querySelector("dialog p em").textContent = userEmail;
  document.querySelector("#newsletter-email input").value = "";
}

function closeSuccessDialog() {
  document.querySelector("dialog").open = false;
}



function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};