getData();


class SpendingDay {
  /**
   * @param {string} day
   * @param {number} amount
   * @param {number} maxAmount
   */

  constructor(day, amount, maxAmount) {
    this.day = day;
    this.amount = amount;
    this.maxAmount = maxAmount;
  }

  get ratio() {
    return this.amount / this.maxAmount;
  } 
}


async function getData() {
  const dataEndpoint = await fetch("assets/data.json");
  const spendingByDays = await dataEndpoint.json();

  const chartContainer = document.querySelector("ul#spending-chart");
  chartContainer.replaceChildren();
  const maxSpendingAmount = Math.max(...spendingByDays.map((s) => s.amount));
  for (const spending of spendingByDays) {
    const day = new SpendingDay(spending.day, spending.amount, maxSpendingAmount);

    const daysItem = document.createElement("li");
    daysItem.textContent = day.day;
    const dayData = document.createElement("data");
    dayData.setAttribute("value", day.amount);
    dayData.setAttribute("style", `--spending-height: ${day.ratio * 100}%;
     --spending-color: var(${day.amount === day.maxAmount ? '--cyan-hsl' : '--soft-red-hsl'})`);
    daysItem.appendChild(dayData);
    chartContainer.appendChild(daysItem);
  }

}