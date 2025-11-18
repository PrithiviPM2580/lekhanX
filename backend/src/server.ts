// ============================================================
// 🧩 Server — Main server setup and configuration
// ============================================================

import app from "@/app.js";

const PORT = 3000; // Define the port number

// ------------------------------------------------------
// startServer() — It starts the Express server
// ------------------------------------------------------
const startServer = () => {
	app.listen(PORT, () => {
		console.log(`Server is running in the http://localhost:${PORT}`);
	});
};

export default startServer;
