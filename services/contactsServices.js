import Contact from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";

async function listContacts({ page, limit, favorite, owner } = {}) {

    const skip = (page - 1) * limit;
    const filter = favorite
        ? { favorite: true, ownerId: owner }
        : { ownerId: owner };

    try {
        const contacts = await Contact.find(filter)
            .skip(skip)
            .limit(parseInt(limit));
        return contacts;
    } catch (error) {
        throw HttpError(500, "Error reading contacts");
    }
}

async function getContactById(_id, ownerId) {
    try {
        const contact = await Contact.findOne({ _id, ownerId });
        return contact;
    } catch (error) {
        throw HttpError(500, "Error getting contact by ID");
    }
}

async function removeContact(_id, ownerId) {
    try {
        const contact = await Contact.findOneAndDelete({ _id, ownerId });
        return contact;
    } catch (error) {
        throw HttpError(500, "Error removing contact");
    }
}

async function addContact({ name, email, phone }, ownerId) {
    try {
        const newContact = new Contact({ name, email, phone, ownerId });
        await newContact.save();
        return newContact;
    } catch (error) {
        throw HttpError(500, "Error adding contact");
    }
}

async function updateContact(_id, updatedContact, ownerId) {
    try {
        const contact = await Contact.findOneAndUpdate({_id, ownerId}, updatedContact, {
            new: true,
        });
        if (!contact) {
            throw HttpError(404, "Contact not found");
        }
        return contact;
    } catch (error) {
        throw HttpError(500, "Error updating contact");
    }
}

const contactsService = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};

export default contactsService;