'use strict';
var canvas = document.querySelector('#canvas1');
var ctx = canvas.getContext('2d');

var gw = 4*Math.PI/500;
var scale = gw*canvas.width;
var zoom = 1;
var freqs = [];

function freq_to_color(f) {
    return 'rgba(' + Math.floor(f/10 * 255) + ',0,'+Math.floor((1-f/10)*255) + ',0.2)';
}

function generate_freqs(n, fn) {
    freqs = [];
    for (var i = 1; i<=n; i++) {
        freqs.push([i,fn(i)]); 
    }
    return freqs;
}

function sawtooth(n) {
    return generate_freqs(n, function(n) {
        return -2/(Math.PI*n)*Math.pow(-1,n)
    });
}

function render_sine(f,a) {
    console.log('rendering' + f + ' ' + a);
    ctx.strokeStyle = freq_to_color(f);
    ctx.beginPath();
    ctx.moveTo(0,ctx.height/2);
    console.log(ctx.strokeStyle);
    for (var x = 0; x<canvas.width; x++) {
        var y = canvas.height/2;
        y -= zoom*canvas.height * a * Math.sin(scale*f*x/canvas.width)/4;
        ctx.lineTo(x,y);
    }
    ctx.stroke();
}

function render(freqs) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //individual components
    for (var i in freqs) {
        render_sine(freqs[i][0], freqs[i][1]);
    }

    var color = 'rgb(20,200,0)';//'rgb(' + a*255 + ',' + 0 + ',' + (1-a)*255 + ')';

    //total signal
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    for (var x = 0; x<canvas.width; x++) {
        var y = canvas.height/2;
        for (var i in freqs) {
            y -= zoom*canvas.height * Math.sin(scale*freqs[i][0]*x/canvas.width)/4 * freqs[i][1];
        }
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function input_handler() {
    zoom = this.value;
    render(freqs);
}

function add_freq() {
    var freq = document.querySelector('#freq').value;
    var amp = document.querySelector('#amp').value;

    freqs.push([freq,amp]);
    render(freqs);
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
        render(freqs);
    });
}

setup();
render(freqs);

