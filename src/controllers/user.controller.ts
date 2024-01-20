import { dbHandler } from "../utils/dbHandler.js";

const registerUser = dbHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
});

export { registerUser };
