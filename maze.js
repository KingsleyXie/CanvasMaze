var canvas = document.getElementById('canvas');
canvas.width = '900';
canvas.height = '900';

canvas.style.width = '900px';
canvas.style.height = '900px';

var ctx = canvas.getContext('2d');

ctx.fillStyle = 'SILVER';
ctx.fillRect(100, 100, 100, 100);

ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.fillRect(10, 10, 50, 50);

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
ctx.fillRect(30, 30, 50, 50);
