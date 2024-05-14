import { serve } from "bun";

const server = serve({
	port: 3000,
	hostname: "localhost",
	fetch(req) {
		if (req.method !== "GET")
			return new Response("Method not allowed", { status: 405 });

		const { pathname } = new URL(req.url);

		if (pathname === "/") return new Response("You are in home page.");
		else if (pathname === "/gopal")
			return new Response("You in dashboard");
		else return new Response("Not found");
	},
});

console.log("Server is running in port", server.port);
