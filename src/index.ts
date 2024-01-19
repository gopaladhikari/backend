import { app } from "./app.js";
import { connectDb } from "./db/index.js";

const { PORT } = process.env;

connectDb().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
