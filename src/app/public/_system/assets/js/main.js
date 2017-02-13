
let sysApp = {};

sysApp.defaults = {
    _chartLen: 40,
};

sysApp.init = function () {
    let chart1 = createLoadAvgChart();
    let chart2 = createCpuUsageChart();
    let socket = io.connect('http://localhost:8182');

    // let history = [0, 0, 0, 0, 0, 0];
    let history = new Array(sysApp.defaults._chartLen).fill(0);
    let labels = new Array(sysApp.defaults._chartLen).fill('t');

    socket.on('sys:info', function(msg) {
        console.log(msg);
        // convert current load avg / cpus
        // in load avg, for 1 CPUS, 1 is 100%
        let cpus = msg.numCpus,
            load = msg.loadavg[0],
            avg = (load * 100) / cpus;

        // move all array values to the right
        // so remove first element and push another one
        history.shift();
        history.push(avg);

        chart1.update({
            labels: labels,
            series: [ history ]
        });

        // CPUS status chart
        let usage = [];
        for (var k in msg.usage) {
            let val = 100 - msg.usage[k].idle;
            usage.push(val);
        }
        
        chart2.update({
            labels: new Array(msg.numCpus).fill('Cpu'),
            series: [ usage ]
        });

        // update other info
        $('#cpus').text(msg.numCpus);
        $('#arch').text(msg.arch);
    });

};

$(function() {
    sysApp.init();
});


function createLoadAvgChart() {
    let history = Array.apply(null, Array(sysApp._chartLen)).map(Number.prototype.valueOf, 0);
    let chart = new Chartist.Line('#loadavg-chart', {
        labels: [],
        series: [
                [],
            ]
        }, {
            fullWidth: true,
            chartPadding: {
                right: 0,
            },
            low: 0,
            high: 100,
            onlyInteger: false,
    });

    return chart;
}

function createCpuUsageChart() {
    var data = {
    labels: [],
    series: [
            [],
        ]
    };

    var options = {
        seriesBarDistance: 10
    };

    var responsiveOptions = [
    ['screen and (max-width: 640px)', {
    seriesBarDistance: 5,
    axisX: {
      labelInterpolationFnc: function (value) {
        return value[0];
      }
    }
    }]
    ];

    let chart = new Chartist.Bar('#cpus-chart', data, options, responsiveOptions);
    return chart;
}
