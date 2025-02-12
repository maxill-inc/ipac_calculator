const elem = (function() {
    const opsDDS = document.getElementById('ops-dds');
    const opsRateDDS = document.getElementById('ops-rate-dds');
    const opsRDH = document.getElementById('ops-rdh');
    const opsRateRDH = document.getElementById('ops-rate-rdh');
    const labourRDH = document.getElementById('labour-rdh');
    const labourRateRDH = document.getElementById('labour-rate-rdh');
    const labourCDA = document.getElementById('labour-cda');
    const labourRateCDA = document.getElementById('labour-rate-cda');
    const labourAdmin = document.getElementById('labour-admin');
    const labourRateAdmin = document.getElementById('labour-rate-admin');
    const btnCalc = document.getElementById('ipac-calculate');
    const btnReset = document.getElementById('ipac-reset');
    const calcResults = document.getElementById('calculator-results');
    const results = document.querySelector('#calculator-results .total-results');
    const runningTotal = document.querySelector('#calculator-results-running-total .running-total');

    return {opsDDS, opsRateDDS, opsRDH, opsRateRDH, labourRDH, labourRateRDH, labourCDA, labourRateCDA, labourAdmin, labourRateAdmin, btnCalc, btnReset, calcResults, results, runningTotal}
})();



const ipacCalc = {
    _ops: {
        dds: {
            num: 0,
            rate: 3000
        },
        rdh: {
            num: 0,
            rate: 1800
        },
    },
    _labour: {
        rdh: {
            num: 0,
            rate: 400
        },
        cda: {
            num: 0,
            rate: 200
        },
        admin: {
            num: 0,
            rate: 200
        }
    },
    _total: {
        _ops: 0,
        _labour: 0
    },
    _runningTotal: 0,
    _dailyCost: 0,
    _intervalTime: 0,
    _interval: null,
    ops: function(){
        this._ops.dds.num = elem.opsDDS.value;
        this._ops.dds.rate = elem.opsRateDDS.value;
        this._ops.rdh.num = elem.opsRDH.value;
        this._ops.rdh.rate = elem.opsRateRDH.value;
    },
    labour: function(){
        this._labour.rdh.num = elem.labourRDH.value;
        this._labour.rdh.rate = elem.labourRateRDH.value;
        this._labour.cda.num = elem.labourCDA.value;
        this._labour.cda.rate = elem.labourRateCDA.value;
        this._labour.admin.num = elem.labourAdmin.value;
        this._labour.admin.rate = elem.labourRateAdmin.value;
    },
    total: function(key) {
        const arr = Object.keys(this[key]);
        let total = 0;
        arr.forEach(elem => {
            total = total + (this[key][elem].num * this[key][elem].rate);
        });
        this._total[key] = total;
    },
    calculate: function(){
        ipacCalc.clearCalcInterval();
        // Gather input data
        this.ops();
        this.labour();
        // Calculate and set totals
        this._runningTotal = 0;
        this.total('_ops');
        this.total('_labour');
        this._dailyCost = (this._total._ops + this._total._labour);
    },
    reset: function(){
        elem.calcResults.classList.remove('show');
        elem.opsDDS.value = 0;
        elem.opsRateDDS.value = 3000;
        elem.opsRDH.value = 0;
        elem.opsRateRDH.value = 1800;
        elem.labourRDH.value = 0;
        elem.labourRateRDH.value = 400;
        elem.labourCDA.value = 0;
        elem.labourRateCDA.value = 200;
        elem.labourAdmin.value = 0;
        elem.labourRateAdmin.value = 200;
        this._runningTotal = 0;
        this._dailyCost = 0;
        this.total('_ops');
        this.total('_labour');
        ipacCalc.clearCalcInterval();
        elem.runningTotal.innerText = '';
    },
    setCalcInterval: function(){
        const dailyCostCents = this._dailyCost*100;
        this._intervalTime = 32400000/dailyCostCents;
        if (dailyCostCents >= 3240000) {
            ipacCalc._intervalTime = 32400000/ipacCalc._dailyCost;
        }
       this._interval = setInterval(ipacCalc.startRunningTotal, ipacCalc._intervalTime);
    },
    clearCalcInterval: function(){
        clearInterval(ipacCalc._interval);
        this._intervalTime = 0;
        this._interval = null;
    },
    startRunningTotal: function(){
        if (ipacCalc._dailyCost >= 324000){
            ipacCalc._runningTotal = ipacCalc._runningTotal + 1;
            elem.runningTotal.innerText = `$${ipacCalc._runningTotal.toFixed(0)}`;
        } else {
            ipacCalc._runningTotal = ipacCalc._runningTotal + 0.01;
            elem.runningTotal.innerText = `$${ipacCalc._runningTotal.toFixed(2)}`;
        }
    }

}


elem.btnCalc.addEventListener('click', (e) => {
    ipacCalc.calculate();
    elem.results.innerText = `1 Day Closure Cost: $${ipacCalc._dailyCost}
      2 Day Closure Cost: $${(ipacCalc._dailyCost*2)}`;
    if (ipacCalc._dailyCost > 0) {
        ipacCalc.setCalcInterval();
    }
    elem.calcResults.classList.add('show');
});

elem.btnReset.addEventListener('click', (e) => {
    ipacCalc.reset();
})

