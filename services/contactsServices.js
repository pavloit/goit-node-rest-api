import Contact from "../db/contacts.js";

async function listContacts() {
    const contacts = await Contact.find();
    return contacts;
}

async function getContactById(contactId) {
    const contact = await Contact.findById(contactId);
    if (!contact) {
        throw new Error("Contact not found");
    }
    return contact;
}

async function removeContact(contactId) {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
        throw new Error("Contact not found");
    }
    return contact;
}

async function addContact({ name, email, phone }) {
    const newContact = new Contact({ name, email, phone });
    const result = await newContact.save();
    return result;
}

async function updateContact(id, updatedContact) {
    const contact = await Contact.findByIdAndUpdate(id, updatedContact, {
        new: true,
    });
    if (!contact) {
        throw new Error("Contact not found");
    }
    return contact;
}

async function updateStatusContact(id, favorite) {
    const contact = await Contact.findByIdAndUpdate(
        id,
        { favorite },
        { new: true }
    );
    if (!contact) {
        throw new Error("Contact not found");
    }
    return contact;
}

const contactsService = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};

export default contactsService;