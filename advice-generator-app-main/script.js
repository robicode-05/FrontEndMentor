getAdvice();

async function getAdvice() {
  const apiResponse = await fetch("https://api.adviceslip.com/advice");
  const advice = await apiResponse.json();

  document.querySelector("h1 span").textContent = advice.slip.id;
  document.querySelector("p span").textContent = advice.slip.advice;
}