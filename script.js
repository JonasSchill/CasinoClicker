var capital = bigInt("0");
var num = [1,0,0,0,0,0,0,0];
var revenue = [1, 16, 256, 4096, 65536, 1048576, 16777216, 268435456];
var time = [1, 4, 16, 64, 256, 1024, 4096, 16384];
var timeLeft = [-1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0];
var baseCost = [4, 64, 1024, 16384, 262144, 4194304, 67108864, 1073741824];
var nextCost = [4, 64, 1024, 16384, 262144, 4194304, 67108864, 1073741824];
var coefficient = [1.16, 1.16, 1.16, 1.16, 1.16, 1.16, 1.16, 1.16];
var dealer = [0, 0, 0, 0, 0, 0, 0, 0];
var dealerCost = [64, 1024, 16384, 262144, 4194304, 67108864, 1073741824, 4294967296];
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