'use strict';
var canvas = document.querySelector('#canvas1');
var ctx = canvas.getContext('2d');

var gw = 4*Math.PI/500;
var freqs = [[1,1]];

function generate_freqs(n, fn) {
    freqs = [];
    for (var i = 1; i<n; i++) {
        freqs.push([i,fn(i)]); 
    }
    return freqs;
}

function sawtooth(n) {
    return generate_freqs(n, function(n) {
        return -2/(Math.PI*n)*Math.pow(-1,n)
    });
}

function generate_graph(freqs) {
    var points = [];
    var scale = gw*canvas.width;
    for (var x = 0; x<canvas.width; x++) {
        var y = canvas.height/2;
        for (var i in freqs) {
            y -= canvas.height * Math.sin(scale*freqs[i][0]*x/canvas.width)/4 * freqs[i][1];
        }
        points.push({
            x: x,
            y: y
        });
    }

    console.log(points);
    var color = 'rgb(200,0,200)';//'rgb(' + a*255 + ',' + 0 + ',' + (1-a)*255 + ')';
    return {points: points, color: color}; 
}


function render(path) {
    var points = path.points;
    var color = path.color;

    ctx.strokeStyle = color; 
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.moveTo(0, canvas.height/2);
    ctx.beginPath();
    for (var i in points) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

function input_handler() {
    var a = this.value; 
    render(generate_graph(freqs));
}

function add_freq() {
    var freq = document.querySelector('#freq').value;
    var amp = document.querySelector('#amp').value;

    freqs.push([freq,amp]);
    render(generate_graph(freqs));
}


function setup() {
    var slider = document.querySelector('#slider');
    slider.addEventListener('input', input_handler);

    var amp = document.querySelector('#amp');
    amp.addEventListener('input', function() {
        document.querySelector('#amp_value').value = this.value;
    });

    var amp_value = document.querySelector('#amp_value');
    amp_value.addEventListener('input', function() {
        document.querySelector('#amp').value = this.value;
    });

    var button = document.querySelector('#add_button');
    button.addEventListener('click', add_freq);

    var button2 = document.querySelector('#reeval');
    button2.addEventListener('click', function() {
        var count = document.querySelector('#count').value;
        freqs = sawtooth(count);
        render(generate_graph(freqs));
    });
}

setup();
render(generate_graph(freqs));

