
const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span");
elements.forEach(element => {
  if (element.children.length === 0) {
    console.log(element);
  }
  
});