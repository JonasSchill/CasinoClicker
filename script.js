var capital = bigInt("0");
var num = [1,0,0,0,0,0,0,0];
var revenue = [1, 64, 550, 4321, 50000, 654321, 7654321, 100000000];
var time = [0.5, 4, 6, 12, 24, 100, 400, 1500];
var timeLeft = [-1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0];
var baseCost = [4, 64, 750, 8765, 100000, 1234567, 16000000, 175000000];
var nextCost = [4, 64, 750, 8765, 100000, 1234567, 16000000, 175000000];
var coefficient = [1.075, 1.15, 1.14, 1.13, 1.12, 1.11, 1.1, 1.09]
var dealer = [0, 0, 0, 0, 0, 0, 0, 0];
var dealerCost = [1000, 16000, 100000, 500000, 1.25e6, 1e7, 123456789, 500000000];
var dps = [1, 0, 0, 0, 0, 0, 0, 0];

function deal(gamenum) {
	var n = parseInt(gamenum);
	if (timeLeft[n] == -1.0 && num[n] > 0) {
		timeLeft[n] = time[n];
	}
}

function buy(gamenum) {
	var n = parseInt(gamenum);
	if (capital >= nextCost[n]) {
		capital -= nextCost[n];
		num[n] += 1;
		dps[n] = Math.round((revenue[n] * num[n])/time[n]);
		nextCost[n] = Math.round(baseCost[n] * (coefficient[n] ** num[n]));
		document.getElementById("capital").innerHTML = capital;
		document.getElementById("num" + gamenum).innerHTML = num[n];
		document.getElementById("cost" + gamenum).innerHTML = nextCost[n];
		document.getElementById("dps" + gamenum).innerHTML = dps[n];
	}
}

function update() {
	var i;
	for (i = 0; i < 8; i++) {
		if (timeLeft[i] != -1.0) {
            timeLeft[i] -= 0.04;
			document.getElementById("bg" + i).style.width = Math.floor(((time[i] - timeLeft[i]) / time[i])*100) + "%";
			if (timeLeft[i] <= 0) {
				capital += num[i] * revenue[i];
				if (dealer[i] == 1) {
					timeLeft[i] = time[i];
				} else {
					timeLeft[i] = -1.0;
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
		document.getElementById("deal" + gamenum).parentElement.remove();
		document.getElementById("buyDealer" + gamenum).parentElement.remove();
		deal(gamenum);
	}
}

window.setInterval(function(){update()}, 30);