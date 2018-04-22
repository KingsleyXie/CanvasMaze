const
	MAX_RANGE_OF_MAZE = 60,
	MIN_RANGE_OF_MAZE = 3,
	generatex = 13,
	generatey = 9,
	outsetx = 2,
	outsety = 1,
	terminalx = 2 * generatex,
	terminaly = 2 * generatey + 1,
	mazerangex = 2 * generatex + 1,
	mazerangey = 2 * generatey + 1;

const dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = '900'; canvas.height = '900';
canvas.style.width = '900px'; canvas.style.height = '900px';

var maze = new Array(MAX_RANGE_OF_MAZE);
for (var i = 0; i < MAX_RANGE_OF_MAZE; i++)
	maze[i] = new Array(MAX_RANGE_OF_MAZE);

var Q = new Array(), Qupdated;

var QnextNum = new Array(MAX_RANGE_OF_MAZE);
for (var i = 0; i < MAX_RANGE_OF_MAZE; i++) {
	QnextNum[i] = new Array(MAX_RANGE_OF_MAZE);
	QnextNum[i].fill(0);
}

var Qpre = new Array(MAX_RANGE_OF_MAZE);
for (var i = 0; i < MAX_RANGE_OF_MAZE; i++) {
	Qpre[i] = new Array(MAX_RANGE_OF_MAZE);
	Qpre[i].fill([0, 0]);
}

var maze_dumps = [];

setup();
generateMaze(randint(generatex), randint(generatey));
paintMaze(maze);

setTimeout(function() {
	searchMazeWithBFS(outsetx, outsety);
	paintMaze(maze);
}, 100);

maze_dumps.forEach(function(m, i) {
	setTimeout(function() {
		paintMaze(m);
	}, 50 * i);
});

function setup() {
	for (var i = 0; i <= generatex * 2 + 2; i++)
		for (var j = 0; j <= generatey * 2 + 2; j++)
			maze[i][j] = (i + j - 2) % 14 + 1;

	for (var i = 0; i <= 2 * generatey + 2; i++) {
		maze[0][i] = 0; maze[2 * generatex + 2][i] = 0;
	}

	for (var i = 0; i <= 2 * generatex + 2; i++) {
		maze[i][0] = 0; maze[i][2 * generatey + 2] = 0;
	}

	maze[outsetx][outsety] = 15; maze[terminalx][terminaly] = 0;
}

function generateMaze(x, y) {
	var doublex = x * 2, doubley = y * 2;
	var phase = (Math.random() > 0.5) ? 1 : 3;

	maze[doublex][doubley] = 0;

	for (var i = 0, step = randint(4) - 1;
		i < 4; i++, step = (step + phase) % 4) {
		if (doubley + dy[step] - 1 != mazerangey
			&& maze[doublex + 2 * dx[step]][doubley + 2 * dy[step]]) {
			maze[doublex + dx[step]][doubley + dy[step]] = -1;
			maze_dumps.push(maze);
			console.log(maze_dumps[95] == maze_dumps[94], maze_dumps.length);
			console.log(maze_dumps[96] == maze_dumps[95], maze_dumps.length);

			maze[doublex + dx[step]][doubley + dy[step]] = 0;
			generateMaze(x + dx[step], y + dy[step]);
		}
	}
}

function searchMazeWithDFS(x, y) {
	if (x == terminalx && y == terminaly) {
		console.log("已到达迷宫的出口位置");
		throw new Error("Terminal Reached!");
	}

	for (var step = 0; step < 4; step++) {
		if ((x + dx[step] > 0)
			&& (x + dx[step] <= mazerangex)
			&& (y + dy[step] > 0)
			&& (y + dy[step] <= mazerangey)
			&& !maze[x + dx[step]][y + dy[step]]) {
			x = x + dx[step]; y = y + dy[step]; maze[x][y] = 15;
			searchMazeWithDFS(x, y);
			maze[x][y] = 16; x = x - dx[step]; y = y - dy[step];
		}
	}
}

function searchMazeWithBFS(x, y) {
	Q.push([x, y]);
	while (Q.length > 0) {
		x = Q[Q.length - 1][0]; y = Q[Q.length - 1][1]; Qupdated = 0;
		console.log(Q[0]);
		console.log(x, y);
		for (var step = 0; step < 4; step++) {
			if ((x + dx[step] > 0)
				&& (x + dx[step] <= mazerangex)
				&& (y + dy[step] > 0)
				&& (y + dy[step] <= mazerangey)
				&& !maze[x + dx[step]][y + dy[step]]) {
				var xstep = x + dx[step], ystep = y + dy[step];
				maze[xstep][ystep] = 17;
				Q.push([xstep, ystep]); Qupdated = 1;
				console.log('Push', xstep, ystep);
				console.log(Q[0]);
				console.log(Q[1]);

				Qpre[xstep][ystep] = [x, y]; QnextNum[x][y]++;

				if (xstep == terminalx && ystep == terminaly) {
					do {
						maze[xstep][ystep] = 15;
						var xtemp = Qpre[xstep][ystep][0];
						ystep = Qpre[xstep][ystep][1];
						xstep = xtemp;
					} while (xstep && ystep);
					console.log("已到达迷宫的出口位置\n");
					throw new Error("Terminal Reached!");
				}
			}
		}

		if (!Qupdated) {
			var deletex = x, deletey = y;
			do {
				maze[deletex][deletey] = 16;

				var xtemp = Qpre[deletex][deletey][0];
				deletey = Qpre[deletex][deletey][1];
				deletex = xtemp;

				QnextNum[deletex][deletey]--;
			} while (deletex && deletey && !QnextNum[deletex][deletey]);
		}
		Q.pop();
	}
}

function randint(max) {
	return Math.ceil(Math.random() * max);
}

function paintMaze(m, presentx, presenty) {
	var color;
	for (var i = 1; i <= mazerangex; i++) {
		for (var j = 1; j <= mazerangey; j++) {
			if ((i == presentx && j == presenty)
				|| (i == -1 && j == -1)) {
				color = '#AEB6BF';
			} else {
				switch (maze[i][j]) {
					case 0: color = '#CCD1D1'; break;
					case 15: color = '#3498DB'; break;
					case 16: color = '#E74C3C'; break;
					case 17: color = '#E74C3C'; break;
					default: color = '#7F8C8D'; break;
				}
			}
			ctx.fillStyle = color;
			ctx.fillRect(i * 25, j * 25, 25, 25);
		}
	}
}
