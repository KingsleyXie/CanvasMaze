const generatex = 15, generatey = 15;

var canvas = document.getElementById('canvas');
canvas.width = '900';
canvas.height = '900';

canvas.style.width = '900px';
canvas.style.height = '900px';

var ctx = canvas.getContext('2d');
// ctx.font = '32px Microsoft YaHei';
// ctx.fillText('苟利国家生死以', 300, 300);

ctx.fillStyle = 'SILVER';

for (var i = 0; i < generatex; i++) {
	for (var j = 0; j < generatex; j++) {
		ctx.fillRect(j * 25, i * 25, 23, 23);
	}
}
