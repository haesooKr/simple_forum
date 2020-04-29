function customEach(custom, options){
  const result = [];
  for(let i=custom.start; i<custom.end; i++){
    if(custom.arr[i]){
      result.push(options.fn(custom.arr[i]));
    }
  }
  return result.join('');
}

module.exports = customEach;