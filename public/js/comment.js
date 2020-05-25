const submitBtn = document.querySelector('button[type=submit]');
const nickname = document.querySelector('input[name=nickname]');
const comment = document.querySelector('input[name=comment]');
submitBtn.addEventListener('click', (e) => {
  let condition = true;
  if(nickname.value.length < 2 || nickname.value.length > 10){
    condition = false;
    alert('Nickname should have 2~15 characters.');
  }
  if(comment.value.length < 2 || comment.value.length > 50){
    condition = false;
    alert('Comment should have 2~50 characters.')
  }
  if(condition === false){
    e.preventDefault();
  }
})