import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";

const registerUser = dbHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    throw new ApiError(400, "All field are required");

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(400, "User already exists");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) throw new ApiError(400, "User not created");

  res
    .status(201)
    .json(new ApiResponse(201, "User created", { user: createdUser }));
});

export { registerUser };
