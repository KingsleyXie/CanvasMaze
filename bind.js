document.getElementById("gen")
.addEventListener('click', function () {
	dumps = []; initialize();
	generateMaze(randint(generatex), randint(generatey));
	mazeGenerated = true; currMaze = JSON.stringify(maze);

	showProcess(30);
});

document.getElementById("dfs")
.addEventListener('click', function () {
	if (!mazeGenerated) return;

	dumps = [];
	maze = JSON.parse(currMaze);
	backTrack = true;

	searchMazeWithDFS(outsetx, outsety, 30);
});

document.getElementById("bfs")
.addEventListener('click', function () {
	if (!mazeGenerated) return;

	dumps = [];
	maze = JSON.parse(currMaze);

	searchMazeWithBFS(outsetx, outsety, 300);
});

document.getElementById("gen-res")
.addEventListener('click', function () {
	dumps = []; initialize();
	generateMaze(randint(generatex), randint(generatey));
	mazeGenerated = true; currMaze = JSON.stringify(maze);

	paintMaze(maze);
});

document.getElementById("dfs-res")
.addEventListener('click', function () {
	if (!mazeGenerated) return;

	dumps = [];
	maze = JSON.parse(currMaze);
	backTrack = true;

	searchMazeWithDFS(outsetx, outsety, 0);
});

document.getElementById("bfs-res")
.addEventListener('click', function () {
	if (!mazeGenerated) return;

	dumps = [];
	maze = JSON.parse(currMaze);

	searchMazeWithBFS(outsetx, outsety, 0);
});
