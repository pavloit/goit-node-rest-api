import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"

export const getAllContacts = async (req, res, next) => {
    const { page = 1, limit = 20, favorite = false } = req.query;
    const owner = req.user.id;
    try {
        const contacts = await contactsService.listContacts({ page, limit, favorite, owner })
        res.status(200).json(contacts);
    } catch (error) {
        next(HttpError(500));
    }
};

export async function getOneContact(req, res, next) {
    const contactId = req.params.id;
    const ownerId = req.user._id;
    const contact = await contactsService.getContactById(contactId, ownerId);
    try {
        if (!contact) {
            return next(HttpError(404, 'Contact not found'));
        }
        res.status(200).json(contact);
    } catch (error) {
        return next(HttpError(500, 'Error getting contact by ID'));
    }
};

export async function deleteContact(req, res, next) {
    const contactId = req.params.id;
    const ownerId = req.user._id;
    const contact = await contactsService.removeContact(contactId, ownerId);
    try {
        if (!contact) {
            throw HttpError(404, "Contact not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        return next(HttpError(500, 'Error removing contact'));
    }
};

export async function createContact(req, res, next) {  
    const contact = await contactsService.addContact(req.body, req.user.id);
    res.status(201).json(contact);
};

export async function updateContact(req, res, next) {
    const contactId = req.params.id;
    const ownerId = req.user._id;
    const contact = await contactsService.updateContact(contactId, req.body, ownerId)
    try {
        if (!contact) {
            throw HttpError(404, "Contact not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        return next(HttpError(500, 'Error updating contact'));
    }
};