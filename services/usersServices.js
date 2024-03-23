import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import nodemailer from "nodemailer"


const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PWD
    }
});

async function sendVerifycationEmail(email) {
    const verificationToken = crypto.randomUUID();

    const message = {
        to: process.env.MESSAGE_TO,
        from: process.env.MESSAGE_FROM,
        subject: "Welcome to contactsBook",
        html: `<h1>Confirm your registration</h1>
                <p style="color: green">To confirm your registration please click on the link below</p>
                <br>
                <a href="http://localhost:8080/api/users/verify/${verificationToken}">
                Phone book registration confirm for ${email}
                </a>`,
        text: `To confirm your registration please open the link: 
               http://localhost:8080/api/users/verify/${verificationToken}`,
    }

    await transport.sendMail(message)
        .then(console.log)
        .catch(console.error)
    return verificationToken;
}

export const registerUser = async (email, password, avatarURL) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = await sendVerifycationEmail(email);

    const user = new User({
        email,
        password: hashedPassword,
        avatarURL,
        verificationToken,
    });
    await user.save();

    return { email, subscription: user.subscription, avatarURL };
};

export async function emailResend(email) {

    try {
        const user = await User.findOne({ email })
        const verificationToken = await sendVerifycationEmail(email);
        await User.findByIdAndUpdate(user._id,
            {
                token: null,
                verify: false,
                verificationToken
            });
        return { "message": "Verification email sent" }
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
        throw HttpError(401, "Your account is not verified, check your E-mail please");
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