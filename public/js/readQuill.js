var quill = new Quill('#editor', {
  modules: {
    toolbar: false,
  },
  theme: 'snow',
  readOnly: true
});
const json = document.querySelector('textarea[name=content]').innerHTML;
quill.setContents(
  JSON.parse(json)
);