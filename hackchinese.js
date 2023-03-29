const translationUrl = 'https://helloacm.com/api/pinyin/?cached&t=1&s=';

const writeCard = () => {
	writeHanzi();
	writePinyin();
}

const stripHtml = (str) => {
	return str.replace(/<\/?[^>]+(>|$)/g, '');
}

const writeHanzi = () => {
	var chars = document.getElementsByClassName('ss-character');

	if (!chars.length || chars[0].innerHTML.length != 1) {
		return;
	}

	for (let i = 0; i < chars.length; i++) {
		let char = chars[i].innerHTML;
		chars[i].innerHTML = '';

		HanziWriter.create(chars[i], char, {
			 width: 80,
			 height: 80,
			 padding: 0,
			 radicalColor: '#024b30',
			 strokeColor: '#000'
		});
	}
}

const parsePinyinData = (data) => {
	var newData = [];

	for (let i = 0; i < data.length; i++) {
		newData.push(pinyinify(data[i])
			.replace(/ /g, '')
			.replace(/，/g, ','));
	}

	return newData.join(' ')
		.replaceAll(' ,', ', ')
		.replaceAll(',', ', ')
		.replace(' 。', '')
}

const writePinyin = () => {
	var elem = document.getElementsByClassName('ss-sentence-character')[0];
	
	if (!elem || elem.done) {
		return;
	}

	elem.done = true;
	var hanzi = stripHtml(elem.innerHTML);

	httpGet(translationUrl + hanzi, (data) => {
		elem.innerHTML = parsePinyinData(data);

		setTimeout(() => {
			document.getElementsByClassName('ss-sentence-character')[0].done = false;
		}, 1000);
	});
}


const httpGet = (url, callback) => {
	fetch(url, { method: 'GET' })
		.then(Result => Result.json())
	    .then(data => {
			callback(data['result']);
	    })
	    .catch(errorMsg => {
	    	console.log(errorMsg);
	    });
}


const setupObserver = () => {
	const observer = new MutationObserver((mutationsList) => {
	    for (var mutation of mutationsList) {
	    	if (mutation.type === 'childList') {
	        	writeCard();
	    	}
	    }
	});

	const nodes = document.getElementById('face-container').getElementsByClassName('ss-character');

	for (let i = 0; i < nodes.length; i++) {
		observer.observe(nodes[i], {
			childList: true
		});
	}
}


setTimeout(() => {
	setupObserver();
	writeCard();
}, 100)