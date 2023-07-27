var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	let dueNowText = this.responseText.substr(
            this.responseText.indexOf('data-react-props="{&quot;numReviewsDueNow&quot;:') + 48, 10);

    	document.getElementById('reviews-due-now').innerHTML = dueNowText.substr(0, dueNowText.indexOf(',&quot;'));

        let dueLaterText = this.responseText.substr(
            this.responseText.indexOf('numReviewsDueLaterToday&quot;:') + 30, 10);

        document.getElementById('reviews-due-later').innerHTML = dueLaterText.substr(0, dueLaterText.indexOf('}'));
    }
};

xhttp.open('GET', 'https://www.hackchinese.com/dashboard');
xhttp.send();