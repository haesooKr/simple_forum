const submitBtn = document.querySelector('button[type="submit"]');
const writer = document.querySelector('input[name="writer"]');;
const subject = document.querySelector('input[name="subject"]');;;
const qlEditor = document.querySelector('.ql-editor');

submitBtn.addEventListener('click', e => {
  let condition = true;
  if( writer.value.length < 2 || writer.value.length > 15){
    condition = false;
    alert('이름은 2글자에서 15글자 사이로 입력해주시기 바랍니다.')
  }
  if ( subject.value.length < 2 || subject.value.length > 50){
    condition = false;
    alert('제목은 2글자에서 50글자 사이로 입력해주시기 바랍니다.')
  }
  if(qlEditor.textContent.length < 20){
    condition = false;
    alert('내용은 20글자 이상 작성해주시기 바랍니다.')
  }
  if(!condition){
    e.preventDefault();
  }
})
