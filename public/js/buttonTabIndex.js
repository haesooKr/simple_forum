const allBtn = document.querySelectorAll('.ql-toolbar button');
const allSpan = document.querySelectorAll('.ql-toolbar span');
allBtn.forEach(button => {
  button.tabIndex = -1;
})
allSpan.forEach(span => {
  span.tabIndex = -1;
})
