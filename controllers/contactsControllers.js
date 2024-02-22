import {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    update
} from "../services/contactsServices.js"
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(HttpError(500));
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const contact = await getContactById(req.params.id);
        if (!contact) {
            next(HttpError(404));
        } 
            res.status(200).json(contact);
    } catch (error) {
        next(HttpError(500));
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const contact = await removeContact(req.params.id);
        if (!contact) {
            next(HttpError(404));
        }
        res.status(200).json(contact);
    } catch (error) {
        next(HttpError(500));
    }
};

export const createContact = async (req, res, next) => {
    try {
        const contact = await addContact(req.body);
        res.status(201).json(contact);
    } catch (error) {
        next(HttpError(400, error.message));
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const contact = await update(
            req.params.id,
            req.body
        );
        if (!contact) {
            next(HttpError(404, "Contact not found"));
        } 
            res.status(200).json(contact);
    } catch (error) {
        next(HttpError(400, error.message));
    }
};