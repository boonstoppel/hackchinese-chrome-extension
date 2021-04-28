var animationIsOn = false;
var charactersByCard = [];
var highlightRadicalsLoopCounter = [];

function initSession() {
  var cardId = $('.card:visible').attr('data-card');
  highlightRadicalsLoop(cardId);
}

function initCard() {
  var cardId = $(this).attr('data-card');
  charactersByCard[cardId] = [];
  highlightRadicalsLoopCounter[cardId] = 0;

  $(this).find('.dictionaryHanzi').each(function(index) {
    initCharacter(index, this, cardId);
  });
}

function getPinyin() {
  var elemChinese = $('.card:visible .ss-sentence-chinese');
  var elemEnglish = $('.card:visible .ss-sentence-english');

  if (elemChinese.attr('data-loading-pinyin')) {
    return;
  }

  if (elemChinese.attr('data-has-pinyin')) {
    togglePinyin();
    return;
  }

  elemChinese.attr('data-loading-pinyin', 1);

  var sentence = elemChinese.html();
  if (!sentence) {
    return;
  }

  sentence = sentence.replace(/<\/?[^>]+(>|$)/g, '');
  $.get('https://helloacm.com/api/pinyin/?s=' + sentence, function(data) {
    elemChinese.attr('data-loading-pinyin', null);
    elemChinese.attr('data-has-pinyin', 1);
    elemEnglish.after('<div class="font-light ss-sentence-pinyin">' + parsePinYin(data) + '</div>');
    elemEnglish.hide();
  });
}

function parsePinYin(data) {
  var str = '';
  for (var i = 0; i < data.result.length; i++) {
    str += (' ' + data.result[i].split(',')[0]);
  }

  return str;
}

function togglePinyin() {
  var elemEnglish = $('.card:visible .ss-sentence-english');
  var elemPinyin = $('.card:visible .ss-sentence-pinyin');

  if (elemEnglish.is(":visible")) {
    elemEnglish.hide();
    elemPinyin.show();
  } else {
    elemEnglish.show();
    elemPinyin.hide();
  }
}

function initCharacter(index, hanziCharacter, cardId) {
  var character = $(hanziCharacter).html();
  if (character == '…') {
    return;
  }

  var elemId = 'hanzi-character-' + cardId + '-' + index;
  $(hanziCharacter).html('').attr('id', elemId);

  charactersByCard[cardId].push(HanziWriter.create(elemId, character, {
    'width': 80,
    'height': 80,
    'padding': 0,
    'delayBetweenStrokes': 300,
    'strokeColor': '#000000',
    'radicalColor': '#000000',
    'outlineColor': '#D3D3D3'
  }));
}

function startAnimation(cardId) {
  animationIsOn = true;

  for (var i = 0; i < charactersByCard[cardId].length; i++) {
    charactersByCard[cardId][i].hideCharacter();
    charactersByCard[cardId][i].updateColor('radicalColor', '#000000');
  }

  charactersByCard[cardId][0].animateCharacter({
    'onComplete': nextAnimation.bind(this, 0, cardId)
  })
}

function nextAnimation(index, cardId) {
  index++

  if (!charactersByCard[cardId][index]) {
    highlightRadicals(cardId);
    
    setTimeout(function() {
      animationIsOn = false;
      highlightRadicalsLoopCounter[cardId] = 0;
      highlightRadicalsLoop(cardId);
    }, 2000);
  } else {
    setTimeout(function() {
      charactersByCard[cardId][index].animateCharacter({
        'onComplete': nextAnimation.bind(this, index, cardId)
      })
    }, 600);
  }
}

function setRadicalColor(cardId, color) {
  for (var i = 0; i < charactersByCard[cardId].length; i++) {
    charactersByCard[cardId][i].updateColor('radicalColor', color);
  }
}

function highlightRadicalsLoop(cardId) {
  setTimeout(function() {
    if (!animationIsOn) {
      setRadicalColor(cardId, '#FF0000');

      setTimeout(function() {
        if (!animationIsOn) {
          setRadicalColor(cardId, '#000000');

          setTimeout(function() {
            if (animationIsOn) {
              return;
            }

            if (highlightRadicalsLoopCounter[cardId] < 6) {
              highlightRadicalsLoopCounter[cardId]++;
              highlightRadicalsLoop(cardId)
            } else {
              highlightRadicalsLoopCounter[cardId] = 0;
            }
          }, 2600);
        }
      }, 1000);
    }
  }, 2000);
}

function highlightRadicals(cardId) {
  setTimeout(function() {
    setRadicalColor(cardId, '#FF0000');

    setTimeout(function() {
      setRadicalColor(cardId, '#000000');
    }, 1000);
  }, 500);
}

function keyHandler(event) {
  var cardId = $('.card:visible').attr('data-card');

  if (event.which == 87) {
    startAnimation(cardId);
  }

  if (event.which == 40 || event.which == 37 || event.which == 39) {
    if (highlightRadicalsLoopCounter[cardId] == 0) {
      highlightRadicalsLoop(cardId);
    }
  }

  if (event.which == 80) {
    getPinyin();
  }
}

$(document).keydown(keyHandler);
$('.card').each(initCard);

setTimeout(initSession, 1000);