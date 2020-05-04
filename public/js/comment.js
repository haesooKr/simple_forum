const submitBtn = document.querySelector('button[type=submit]');
const nickname = document.querySelector('input[name=nickname]');
const comment = document.querySelector('input[name=comment]');
submitBtn.addEventListener('click', (e) => {
  let condition = true;
  if(nickname.value.length < 2 || nickname.value.length > 10){
    condition = false;
    alert('닉네임은 2글자 이상, 10글자 이하로 입력해주시기 바랍니다.');
  }
  if(comment.value.length < 2 || comment.value.length > 50){
    condition = false;
    alert('댓글 내용을 2글자 이상, 50자 이하로 입력해주시기 바랍니다.')
  }
  if(condition === false){
    e.preventDefault();
  }
})