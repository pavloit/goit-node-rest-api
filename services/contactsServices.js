const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "db/contacts.json")

async function readContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
}

function writeContacts(contacts) {
    return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
    try {
        const contacts = await readContacts();
        return contacts;
    } catch (error) {
        console.error("Error reading contacts:", error)
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await readContacts();
        const contact = contacts.find(contact => contact.id === contactId);
        return contact;
    } catch (error) {
        console.error("Error getting contact by ID:", error)
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await readContacts();
        const index = contacts.findIndex((contact) => contact.id === contactId);
        if (index === -1) {
            return null;
        }
        const deletedContact = contacts.splice(index, 1);
        await writeContacts(contacts);
        return deletedContact;

    } catch (error) {
        console.error("Error removing contact:", error)
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await readContacts();
        const newcontact = { id: crypto.randomUUID(), name, email, phone };
        contacts.push(newcontact);
        await writeContacts(contacts);
        return newcontact;

    } catch (error) {
        console.error("Error adding new contact:", error)
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};