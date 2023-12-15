# Frontend Mentor - Expenses chart component solution

This is a solution to the [Expenses chart component challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/expenses-chart-component-e7yJBUdjwt). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)


## Overview

### The challenge

Users should be able to:

- View the bar chart and hover over the individual bars to see the correct amounts for each day
- See the current day’s bar highlighted in a different colour to the other bars
- View the optimal layout for the content depending on their device’s screen size
- See hover states for all interactive elements on the page
- **Bonus**: Use the JSON data file provided to dynamically size the bars on the chart

### Screenshot

![](screenshot.png)

### Links

- Solution URL: [Github repo](https://github.com/robicode-05/front-end-mentor/tree/master/expenses-chart-component)
- Live Site URL: [Github live demo](https://robicode-05.github.io/front-end-mentor/expenses-chart-component/index.html)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid

### What I learned

I wanted to make the popover entirely in css by retriving the value directly from html
see documentation: [<data> MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Element/data)


I tried with this code:

```js
dayData.setAttribute("value", day.amount);
```
```css
#spending-chart li data:hover::before {
  opacity: 1;
  position: absolute;
  content: '$' attr(value);
  top: 0;
  left: 50%;
  transform: translate(-50%, -120%);
  background-color: var(--dark-brown);
  color: var(--very-pale-orange);
  border-radius: 0.3em;
  padding: 0.4em;
  font-size: 0.8em;
}
```

I'm pretty happy with the result, and in the futur I will reuse this !
