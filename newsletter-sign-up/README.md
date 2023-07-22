# Frontend Mentor - Newsletter sign-up form with success message solution

This is a solution to the [Newsletter sign-up form with success message challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/newsletter-signup-form-with-success-message-3FC1AZbNrv). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 


### Links

- Solution URL: [Github repo](https://github.com/robicode-05/front-end-mentor/tree/master/newsletter-sign-up)
- Live Site URL: [Github live demo](https://robicode-05.github.io/front-end-mentor/newsletter-sign-up/)

## My process

### Built with

- HTML5
- CSS3
- Vanilla JS

### What I used

I wanted to give it a try with html tag dialog combine with 
css3 attribute selector

So in order to display the success dialog, the JS code triggers
the open value of the dialog element

```js
/* Display dialog */
document.querySelector("dialog").open = true;
/* Hide Dialog */
document.querySelector("dialog").open = false;
```

And when answering  the question about hiding the previous form,
I did not want to add a new div to my HTML (don't ask why, why not xD)

So I tried 2 ways :

* 1st : create an overlay for the dialog with the ::before pseudo-element 
```css
dialog {
  position: relative;
}

dialog::before {
  position: absolute;
  content: "";
  z-index: -1;
  inset: 0;
  .
  .
  .
}
```

but the position relative needed for the pseudo element was making the placement to the center harder
than I thought

So I opted for an another approch:

* 2nd: Hide the previous form with css
```css
/* hide main content when success dialog is opened */
dialog[open] + main {
  display: none;
}

/* hide the dialog when it's not opened */
dialog:not([open]) {
  display: none;
}

```

It was a fun challenge !



### Screenshot

#### Desktop
!["render desktop"](result/desktop.png)
#### Mobile
!["render mobile"](result/mobile.png)


## Author
- Frontend Mentor - [@robicode-05](https://www.frontendmentor.io/profile/robicode-05)
