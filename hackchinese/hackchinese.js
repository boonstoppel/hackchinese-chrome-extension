$('.dictionaryHanzi').each(function(index) {
  var character = $(this).html();
  
  if (!character || typeof character != 'string') {
    return;
  }

  var id = 'hanzi-character-' + index;
  $(this).html('').attr('id', id);

  var writer = HanziWriter.create(id, character, {
    width: 80,
    height: 80,
    padding: 5,
    strokeColor: '#666666',
    radicalColor: '#000000'
  });
})


