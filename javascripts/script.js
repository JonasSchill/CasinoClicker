var capital = bigInt("0");
var num = [1,0,0,0,0,0,0,0,0,0];
var revenue = [1, 64, 550, 4321, 50000, 654321, 7654321, 100000000, 1000000000, 30000000000];
var time = [0.5, 4, 6, 12, 24, 100, 400, 1500, 6000, 35000];
var timeLeft = [-1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0];
var baseCost = [4, 64, 750, 8765, 100000, 1234567, 16000000, 175000000, 2000000000, 25000000000];
var nextCost = [4, 64, 750, 8765, 100000, 1234567, 16000000, 175000000, 2000000000, 30000000000];
var coefficient = [1.075, 1.15, 1.14, 1.13, 1.12, 1.11, 1.1, 1.09, 1.08, 1.07]
var dealer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var dealerCost = [1000, 16000, 100000, 500000, 1.25e6, 1.0e7, 123456789, 500000000, 1.0e10, 1.0e11];
var dps = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var multipliers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var dateOne;
var dateTwo;

function deal(gamenum) {
	var n = parseInt(gamenum);
	if (timeLeft[n] == -1.0 && num[n] > 0) {
		timeLeft[n] = time[n];
		if (dealer[n] == 0) {
			disable("deal"  + gamenum.toString());
		}
	}
}

function buy(gamenum) {
	var n = parseInt(gamenum);
	if (capital >= nextCost[n]) {
		capital -= nextCost[n];
		num[n] += 1;
		dps[n] = Math.floor((revenue[n] * num[n])/time[n]);
		nextCost[n] = Math.round(baseCost[n] * (coefficient[n] ** num[n]));
		document.getElementById("capital").innerHTML = capital;
		document.getElementById("num" + gamenum).innerHTML = num[n];
		document.getElementById("cost" + gamenum).innerHTML = nextCost[n];
		document.getElementById("dps" + gamenum).innerHTML = dps[n];
		if ((document.getElementById("deal" + gamenum.toString()).className == "invisible") && (document.getElementById("buyDealer" + gamenum.toString()).className == "invisible")) {
			enable("deal" + gamenum.toString());
			enable("buyDealer" + gamenum.toString());
		}	
	}
}

function update() {
	var i;
	for (i = 0; i < 10; i++) {
		if (timeLeft[i] != -1.0) {
            timeLeft[i] -= 0.04;
			document.getElementById("bg" + i).style.width = Math.floor(((time[i] - timeLeft[i]) / time[i])*100) + "%";
			if (timeLeft[i] <= 0) {
				capital += num[i] * (revenue[i] * multipliers[i]);
				if (dealer[i] == 1) {
					timeLeft[i] = time[i];
				} else {
					timeLeft[i] = -1.0;
					enable("deal" + i);
				}
				document.getElementById("capital").innerHTML = capital;
				document.getElementById("bg" + i).style.width = "0%";
			}
		}
	}
}

function buyDealer(gamenum) {
	var n = parseInt(gamenum);
	if (capital >= dealerCost[n] && dealer[n] == 0 && num[n] >= 1) {
		capital -= dealerCost[n];
		dealer[n] = 1;
		document.getElementById("capital").innerHTML = capital;
		document.getElementById("deal" + gamenum).parentElement.remove();
		document.getElementById("buyDealer" + gamenum).parentElement.remove();
		deal(gamenum);
	}
}

/*--------------------------------------- DISPLAY FEATURES*/

function disable(id) {
	console.log(id)
	document.getElementById(id).className = "disabled";
}

function enable(id) {
	console.log(id)
	document.getElementById(id).className = "enabled";
}

window.setInterval(function(){update()}, 30);

/*--------------------------------------- SAVE LOAD CLEAR*/

function clearStorage() {
	localStorage.clear();
}

function save() {
	localStorage.setItem('capital', capital.toString());
	localStorage.setItem('num', JSON.stringify(num));
	localStorage.setItem('dealer', JSON.stringify(dealer));
	dateOne = new Date();
	dateOne = dateOne.getTime();
	localStorage.setItem('date', JSON.stringify(dateOne));
}

function load() {
	var tdate = JSON.parse(localStorage.getItem('date'));
	dateOne = tdate;

	var tcapital = localStorage.getItem('capital');
	if (tcapital != null) {
		capital = bigInt(tcapital);
		document.getElementById("capital").innerHTML = capital;
	}
	
	
	var tnum = JSON.parse(localStorage.getItem('num'));
	if (tnum != null) {
		num = tnum;
		var i;
		for (i = 0; i < 10; i++) {
			document.getElementById("num" + i).innerHTML = num[i];
			if ((document.getElementById("deal" + i).className == "invisible") && (document.getElementById("buyDealer" + i).className == "invisible") && num[i] >= 1) {
				enable("deal" + i);
				enable("buyDealer" + i);
			}
			dps[i] = revenue[i] * num[i];
			document.getElementById("dps" + i).innerHTML = dps[i];
		}
	}
	
	var tdealer = JSON.parse(localStorage.getItem("dealer"));
	if (tdealer != null) {
		dealer = tdealer;
		var i;
		for (i = 0; i < 10; i++) {
			if (dealer[i] == 1) {
				document.getElementById("deal" + i).parentElement.remove();
				document.getElementById("buyDealer" + i).parentElement.remove();
				deal(i);
			}
			
		}
	}
}


function pageLoaded() {
	load();
	if (dateOne != null) {
		console.log(dateOne);
		dateTwo = new Date();
		dateTwo = dateTwo.getTime();
		console.log(dateTwo);
		var timeDiff = dateTwo - dateOne;
		timeDiff /= 1000;
		var diffSeconds = Math.round(timeDiff);
		diffSeconds = parseInt(diffSeconds);
		var i;
		for (i = 0; i < 10; i++) {
			if (num[i] >= 1 && dealer[i] == 1) {
				capital += Math.floor(((revenue[i] * num[i])/time[i]) * diffSeconds);
			}
		}
		document.getElementById("capital").innerHTML = capital;
	}
	
}


window.onload = pageLoaded;




window.setInterval(function(){save()}, 6000);
