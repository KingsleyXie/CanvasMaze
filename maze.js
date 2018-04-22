const
	MAX_RANGE_OF_MAZE = 60,
	MIN_RANGE_OF_MAZE = 3,
	generatex = 12,
	generatey = 15,
	outsetx = 2,
	outsety = 1,
	terminalx = 2 * generatex,
	terminaly = 2 * generatey + 1,
	mazerangex = 2 * generatex + 1,
	mazerangey = 2 * generatey + 1;

const dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];

var maze = new Array(MAX_RANGE_OF_MAZE);
for (var i = 0; i < MAX_RANGE_OF_MAZE; i++)
	maze[i] = new Array(MAX_RANGE_OF_MAZE);

function setup() {
	for (var i = 0; i <= generatex * 2 + 2; i++)
		for (var j = 0; j <= generatey * 2 + 2; j++)
			maze[i][j] = (i + j - 2) % 14 + 1;

	for (var i = 0; i <= 2 * generatey + 2; i++ ) {
		maze[0][i] = 0; maze[2 * generatex + 2][i] = 0;
	}

	for (var i = 0; i <= 2 * generatex + 2; i++ ) {
		maze[i][0] = 0; maze[i][2 * generatey + 2] = 0;
	}

	maze[outsetx][outsety] = 15; maze[terminalx][terminaly] = 0;
}
setup();
console.table(maze);

generateMaze(randint(generatex), randint(generatey));
console.table(maze);

function generateMaze(x, y) {
	var doublex = x * 2, doubley = y * 2;
	var phase = (Math.random() > 0.5) ? 1 : 3;

	maze[doublex][doubley] = 0;

	for (var i = 0, step = randint(4) - 1;
		i < 4; i++, step = (step + phase) % 4 ) {
		if (doubley + dy[step] - 1 != mazerangey
			&& maze[doublex + 2 * dx[step]][doubley + 2 * dy[step]]) {
			maze[doublex + dx[step]][doubley + dy[step]] = 0;
			generateMaze( x + dx[step], y + dy[step] );
		}
	}
}

function randint(max) {
	return Math.ceil(Math.random() * max);
}



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


resetColor(0, 0, 'RED');
resetColor(3, 5, 'BLUE');

function resetColor(x, y, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x * 25, y * 25, 23, 23);
}
