const submitBtn = document.querySelector('button[type="submit"]');
const writer = document.querySelector('input[name="writer"]');;
const subject = document.querySelector('input[name="subject"]');;;
const qlEditor = document.querySelector('.ql-editor');

submitBtn.addEventListener('click', e => {
  let condition = true;
  if( writer.value.length < 2 || writer.value.length > 15){
    condition = false;
    alert('Nickname should have 2~15 characters.')
  }
  if ( subject.value.length < 2 || subject.value.length > 50){
    condition = false;
    alert('Title should have 2~50 characters.')
  }
  if(qlEditor.textContent.length < 20){
    condition = false;
    alert('Content should have more than 20 characters')
  }
  if(!condition){
    e.preventDefault();
  }
})
