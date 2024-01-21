import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { registerSchema } from "../schema/register.schema.js";
import { RegisterUser } from "./controller.js";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new ApiError(400, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = dbHandler(async (req, res) => {
  const userData: RegisterUser = req.body;

  const validate = registerSchema.safeParse(userData).success;

  if (!validate) throw new ApiError(400, "All field are required");

  const existedUser = await User.findOne({ email: userData.email });

  if (existedUser)
    throw new ApiError(409, "User already exist with this email.");

  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) throw new ApiError(400, "User not created");

  res
    .status(201)
    .json(new ApiResponse(201, "User created", { user: createdUser }));
});

const loginUser = dbHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "All field are required");

  const existedUser = await User.findOne({ email });
  if (!existedUser) throw new ApiError(400, "User not found");

  const isPasswordCorrect = await existedUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id
  );

  const loginedUser = await User.findById(existedUser._id).select("-password");
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "Login successful", {
        user: loginedUser,
        accessToken,
        refreshToken,
      })
    );
});

export { registerUser, loginUser };
