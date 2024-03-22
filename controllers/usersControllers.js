import * as usersService from "../services/usersServices.js";
import User from "../db/user.js";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import jimp from "jimp";



export const register = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const avatarURL = gravatar.url(
            email,
            { s: "100", r: "x", d: "retro" },
            true
        );
        const user = await usersService.registerUser(email, password, avatarURL);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const result = await usersService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            throw new Error("User not authorized");
        }
        await usersService.logoutUser(req.user._id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        console.log(req.user);
        console.log(req.user._id);
        if (!req.user || !req.user._id) {
            throw new Error("User not authorized");
        }
        const user = await usersService.getCurrentUser(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    const { subscription } = req.body;

    try {
        if (!req.user || !req.user._id || !subscription) {
            throw new Error("User ID and subscription are required");
        }
        const user = await usersService.updateSubscription(
            req.user._id,
            subscription
        );
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export async function uploadAvatar(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        const imagePath = path.join(process.cwd(), 'tmp', req.file.filename);

        const image = await jimp.read(req.file.path);
        await image.resize(250, 250).writeAsync(imagePath);

        await fs.rename(
                req.file.path,
                path.join(process.cwd(), "public/avatars", req.file.filename)
            );

            const user = await User.findByIdAndUpdate(req.user.id,
                { avatarURL: `http://localhost:8080/avatars/${req.file.filename}` },
                { new: true }
            );
            if (user === null) {
                return res.status(404).send({ message: "User not found" })
            }
            res.send(user);
        } catch (error) {
            next(error)
        }
}

export async function getAvatar(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        
        if (user === null) {
            return res.status(404).send({ message: "User not found" })
        };
        if (user.avatar === null) {
            return res.status(404).send({ message: "Avatar not found" })
        };
        res.sendFile(path.join(process.cwd(), "public/avatars", user.avatar));
    } catch (error) {
        next(error)
    }
}
