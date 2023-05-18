const translationUrl = 'https://helloacm.com/api/pinyin/?cached&t=1&s='
const pinyinCache = {};

const addPinyinKeyListener = () => {
	document.addEventListener('keypress', (event) => {
	 	if (event.code == 'KeyP') {
	 		togglePinyin()
	 	}
	}, false)
}

const byId = (id) => {
	return document.getElementById(id)
}

const byClass = (className, elem) => {
	if (!elem) {
		elem = window.document
	}

	return elem.getElementsByClassName(className)
}

const firstByClass = (className, elem) => {
	return byClass(className, elem)[0]
}

const stripHtml = (str) => {
	return str.replace(/<\/?[^>]+(>|$)/g, '')
}

const writeHanzi = () => {
	var chars = byClass('ss-character')

	if (!chars.length || chars[0].innerHTML.length != 1) {
		return
	}

	for (let i = 0; i < chars.length; i++) {
		let char = chars[i].innerHTML
		chars[i].innerHTML = ''

		HanziWriter.create(chars[i], char, {
			 width: 80,
			 height: 80,
			 padding: 0,
			 radicalColor: '#024b30',
			 strokeColor: '#000'
		})
	}

	firstByClass('ss-sentence-character').oldData = null
}

const parsePinyinData = (data) => {
	var newData = []

	for (let i = 0; i < data.length; i++) {
		newData.push(pinyinify(data[i])
			.replace(/ /g, '')
			.replace(/，/g, ','))
	}

	return newData.join(' ')
		.replaceAll(' ,', ', ')
		.replaceAll(',', ', ')
		.replace(' 。', '')
}

const togglePinyin = () => {
	var elem = firstByClass('ss-sentence-character')
	
	if (!elem || elem.parentNode.classList.contains('opacity-0')) {
		return
	}

	if (elem.oldData) {
		revertPinyin(elem)
	} else {
		writePinyin(elem)
	}
}

const playAudio = () => {
	var elem = firstByClass('ss-pinyin')
	
	if (!elem) {
		return
	}

	firstByClass('cursor-pointer', byId('replay-buttons')).click()
}

const revertPinyin = (elem) => {
	if (elem.oldData) {
		elem.innerHTML = elem.oldData
	}

	elem.oldData = null
}

const writePinyin = (elem) => {
	elem.oldData = elem.innerHTML

	httpGet(translationUrl + stripHtml(elem.innerHTML), (data) => {
		elem.innerHTML = parsePinyinData(data)
	})
}

const httpGet = (url, callback) => {
	if (pinyinCache[url]) {
		return callback(pinyinCache[url]);
	}

	fetch(url, { method: 'GET' })
		.then(Result => Result.json())
	    .then(data => {
	    	pinyinCache[url] = data['result']
			callback(data['result'])
	    })
	    .catch(errorMsg => {
	    	console.log(errorMsg)
	    })
}


const setupObserver = () => {
	const characterObserver = new MutationObserver((mutationsList) => {
	    for (var mutation of mutationsList) {
	    	if (mutation.type === 'childList') {
	        	writeHanzi()
	    	}
	    }
	})

	const characterNodes = byClass('ss-character', byId('face-container'))
	for (let i = 0; i < characterNodes.length; i++) {
		characterObserver.observe(characterNodes[i], {
			childList: true
		})
	}

	const pinyinObserver = new MutationObserver((mutationsList) => {
		let elem = firstByClass('ss-pinyin', byId('face-container'))

		if (elem && elem.classList.contains('opacity-100')) {
			playAudio()
		}
	})

	const pinyinNodes = byClass('ss-pinyin', byId('face-container'))
	for (let i = 0; i < pinyinNodes.length; i++) {
		pinyinObserver.observe(pinyinNodes[i], {
			attributes: true
		})
	}
}


setTimeout(() => {
	setupObserver()
	writeHanzi()
	addPinyinKeyListener()
}, 100)