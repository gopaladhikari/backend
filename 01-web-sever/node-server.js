const http = require("http");

const hostname = "localhost";
const port = process.env.PORT || 3002;

const server = http.createServer((req, res) => {
	const { url } = req;

	if (url === "/") res.end("You are in home page.");
	else if (url === "/gopal") res.end("You in dashboard");
	else res.end("Not found");
});

server.listen(port, hostname, () => {
	console.log("Server is running in port 3000");
});
