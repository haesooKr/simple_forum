
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        
    ['link'],


    [{ 'header': 1 }, { 'header': 2 }],               
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      
    [{ 'indent': '-1' }, { 'indent': '+1' }],          
    [{ 'direction': 'rtl' }],                        

    [{ 'color': [] }, { 'background': [] }],         
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         
  ];

  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
    }
  });

  const form = document.querySelector('form');
  form.onsubmit = function () {

    const about = document.querySelector('textarea[name=content]');
    let json = JSON.stringify(quill.getContents());

    json = json.split('').map(char => {
      if (char === '\\') return '\\\\';
      else {
        return char;
      }
    }).join('');

    about.value = json;

    return true;
  };
