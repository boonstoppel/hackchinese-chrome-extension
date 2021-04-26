var animationIsOn = false;
var charactersByCard = [];

function startAnimation(characters) {
  animationIsOn = true;

  for (var i = 0; i < characters.length; i++) {
    characters[i].hideCharacter();
    characters[i].updateColor('radicalColor', '#000000');
  }

  characters[0].animateCharacter({
    'onComplete': nextAnimation.bind(this, 0, characters)
  })
}

function nextAnimation(index, characters) {
  index++

  if (!characters[index]) {
    highlightRadicals(characters);
    animationIsOn = false;
    
    setTimeout(function() {
      highlightRadicalsLoop(characters)
    }, 2000);
  } else {
    setTimeout(function() {
      characters[index].animateCharacter({
        'onComplete': nextAnimation.bind(this, index, characters)
      })
    }, 1000);
  }
}

function setRadicalColor(characters, color) {
  for (var i = 0; i < characters.length; i++) {
    characters[i].updateColor('radicalColor', color);
  }
}

function highlightRadicalsLoop(characters) {
  setTimeout(function() {
    if (!animationIsOn) {
      setRadicalColor(characters, '#FF0000');

      setTimeout(function() {
        if (!animationIsOn) {
          setRadicalColor(characters, '#000000');

          setTimeout(function() {
            highlightRadicalsLoop(characters)
          }, 2000);
        }
      }, 1000);
    }
  }, 2000);
}

function highlightRadicals(characters) {
  setTimeout(function() {
    setRadicalColor(characters, '#FF0000');

    setTimeout(function() {
      setRadicalColor(characters, '#000000');
    }, 1000);
  }, 500);
}

$(document).keydown(function(event) {
  if (event.which == 87) {
    var cardId = $('.card:visible').attr('data-card');
    startAnimation(charactersByCard[cardId]);
  }
});


$('.card').each(function() {
  var cardId = $(this).attr('data-card');
  charactersByCard[cardId] = [];

  $(this).find('.dictionaryHanzi').each(function(index) {
    var character = $(this).html();
    var elemId = 'hanzi-character-' + cardId + '-' + index;

    $(this).html('').attr('id', elemId);

    charactersByCard[cardId].push(HanziWriter.create(elemId, character, {
      'width': 80,
      'height': 80,
      'padding': 0,
      'delayBetweenStrokes': 300,
      'strokeColor': '#000000',
      'radicalColor': '#000000',
      'outlineColor': '#D3D3D3'
    }));
  });


  highlightRadicalsLoop(charactersByCard[cardId]);
});
