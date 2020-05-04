const submitBtn = document.querySelector('button[type=submit]');
const nickname = document.querySelector('input[name=nickname]');
const comment = document.querySelector('input[name=comment]');
submitBtn.addEventListener('click', (e) => {
  let condition = true;
  if(nickname.value.length < 3){
    condition = false;
    alert('닉네임은 3글자 이상이여야 합니다.');
  }
  if(!comment.value){
    condition = false;
    alert('댓글 내용을 입력해주시기 바랍니다.');
  }
  if(condition === false){
    e.preventDefault();
  }
})