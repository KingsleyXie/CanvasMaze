const
	MAX_RANGE_OF_MAZE = 50,
	MIN_RANGE_OF_MAZE = 3,
	generatex = 23, generatey = 11,
	outsetx = 2, outsety = 1,
	terminalx = 2 * generatex,
	terminaly = 2 * generatey + 1,
	mazerangex = 2 * generatex + 1,
	mazerangey = 2 * generatey + 1;

const dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var maze = new Array(MAX_RANGE_OF_MAZE);
for (var i = 0; i < MAX_RANGE_OF_MAZE; i++)
	maze[i] = new Array(MAX_RANGE_OF_MAZE);

initialize();
paintMaze(maze);

let dumps = [];
let backTrack = true;
let mazeGenerated = false, currMaze = '';

function initialize() {
	canvas.width = (mazerangex + 2) * 25;
	canvas.height = (mazerangey + 2) * 25;

	canvas.style.width = (mazerangex + 2) * 25;
	canvas.style.height = (mazerangey + 2) * 25;

	for (var i = 0; i <= generatex * 2 + 2; i++)
		for (var j = 0; j <= generatey * 2 + 2; j++)
			maze[i][j] = (i + j - 2) % 14 + 1;

	for (var i = 0; i <= 2 * generatey + 2; i++) {
		maze[0][i] = 0; maze[2 * generatex + 2][i] = 0;
	}

	for (var i = 0; i <= 2 * generatex + 2; i++) {
		maze[i][0] = 0; maze[i][2 * generatey + 2] = 0;
	}

	maze[outsetx][outsety] = 15;
	maze[terminalx][terminaly] = 0;
}

function generateMaze(x, y) {
	var doublex = x * 2, doubley = y * 2;
	var phase = (Math.random() > 0.5) ? 1 : 3;

	maze[doublex][doubley] = 0;

	for (var i = 0, step = randint(4) - 1;
		i < 4; i++, step = (step + phase) % 4) {
		if (doubley + dy[step] - 1 != mazerangey
			&& maze[doublex + 2 * dx[step]][doubley + 2 * dy[step]]) {
			maze[doublex + dx[step]][doubley + dy[step]] = 0;
			dumps.push(JSON.stringify(maze));
			generateMaze(x + dx[step], y + dy[step]);
		}
	}
}

function searchMazeWithDFS(x, y, t) {
	if (x == terminalx && y == terminaly) {
		if (t == 0) paintMaze(maze);
		else showProcess(t);

		backTrack = false;
		throw "Terminal reached in DFS.";
	} else {
		for (var step = 0; step < 4; step++) {
			if ((x + dx[step] > 0)
				&& (x + dx[step] <= mazerangex)
				&& (y + dy[step] > 0)
				&& (y + dy[step] <= mazerangey)
				&& !maze[x + dx[step]][y + dy[step]]) {
				x = x + dx[step]; y = y + dy[step];

				maze[x][y] = 15;
				dumps.push(JSON.stringify(maze));

				searchMazeWithDFS(x, y, t);

				if (backTrack) {
					maze[x][y] = 16; x = x - dx[step]; y = y - dy[step];
					dumps.push(JSON.stringify(maze));
				}
			}
		}
	}
}

function searchMazeWithBFS(x, y, t) {
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

	Q.push([x, y]);
	while (Q.length > 0) {
		x = Q[0][0]; y = Q[0][1]; Qupdated = 0;
		for (var step = 0; step < 4; step++) {
			if ((x + dx[step] > 0)
				&& (x + dx[step] <= mazerangex)
				&& (y + dy[step] > 0)
				&& (y + dy[step] <= mazerangey)
				&& !maze[x + dx[step]][y + dy[step]]) {

				var xstep = x + dx[step], ystep = y + dy[step];
				maze[xstep][ystep] = 17;
				dumps.push(JSON.stringify(maze));

				Q.push([xstep, ystep]); Qupdated = 1;
				Qpre[xstep][ystep] = [x, y];
				QnextNum[x][y]++;

				if (xstep == terminalx && ystep == terminaly) {
					do {
						maze[xstep][ystep] = 15;
						dumps.push(JSON.stringify(maze));

						var xtemp = Qpre[xstep][ystep][0];
						ystep = Qpre[xstep][ystep][1];
						xstep = xtemp;
					} while (xstep && ystep);

					if (t == 0) paintMaze(maze);
					else showProcess(t);
					throw "Terminal reached in BFS.";
				}
			}
		}

		if (!Qupdated) {
			var stepBackx = x, stepBacky = y;
			while (stepBackx && stepBacky
				&& !QnextNum[stepBackx][stepBacky]) {
				maze[stepBackx][stepBacky] = 16;
				dumps.push(JSON.stringify(maze));

				var xtemp = Qpre[stepBackx][stepBacky][0];
				stepBacky = Qpre[stepBackx][stepBacky][1];
				stepBackx = xtemp;

				QnextNum[stepBackx][stepBacky]--;
			}
		}
		Q.shift();
	}
}

function randint(max) {
	return Math.ceil(Math.random() * max);
}

function paintMaze(m) {
	var color;
	for (var i = 1; i <= mazerangex; i++) {
		for (var j = 1; j <= mazerangey; j++) {
			switch (m[i][j]) {
				case 0: color = '#CCD1D1'; break; //Accessable Paths
				case 15: color = '#48C9B0'; break; // Maze Solution
				case 16: color = '#F1948A'; break; // Unaccessable Paths
				case 17: color = '#85C1E9'; break; // Trying Paths In BFS
				default: color = '#99A3A4'; break; // Walls
			}

			ctx.fillStyle = color;
			ctx.fillRect(i * 25, j * 25, 25, 25);
		}
	}
}

function showProcess(t) {
	dumps.forEach(function(m, i) {
		setTimeout(function() {
			paintMaze(JSON.parse(m));
		}, i * t);
	});

	setTimeout(function() {
		paintMaze(maze);
	}, dumps.length * t);
}
