import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/user.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (email, password, avatarURL) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, avatarURL });
    await user.save();

    return { email, subscription: user.subscription, avatarURL };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(user._id, { token });

    return {
        token,
        user: {
            _id: user._id,
            email: user.email,
            subscription: user.subscription,
        },
    };
};

export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, { token: null });
};

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw HttpError(401, "Not authorized");
    }
    return {
        email: user.email,
        subscription: user.subscription,
    };
};

export const updateSubscription = async (userId, subscription) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { subscription },
        { new: true }
    );
    if (!user) {
        throw HttpError(404, "User not found");
    }
    return {
        email: user.email,
        subscription: user.subscription,
    };
};