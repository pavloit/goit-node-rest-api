import fs from "fs/promises"
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const { randomUUID } = await import('node:crypto');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

async function readContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
}

function writeContacts(contacts) {
    return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

export async function listContacts() {
    try {
        const contacts = await readContacts();
        return contacts;
    } catch (error) {
        console.error("Error reading contacts:", error)
    }
}

export async function getContactById(contactId) {
    try {
        const contacts = await readContacts();
        const contact = contacts.find(contact => contact.id === contactId);
        return contact;
    } catch (error) {
        console.error("Error getting contact by ID:", error)
    }
}

export async function removeContact(contactId) {
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

export async function addContact({ name, email, phone }) {
    try {
        const contacts = await readContacts();
        const newcontact = { id: randomUUID(), name, email, phone };
        contacts.push(newcontact);
        await writeContacts(contacts);
        return newcontact;

    } catch (error) {
        console.error("Error adding new contact:", error)
    }
}

export async function update(id, updatedContact) {
    try {
        const contacts = await listContacts();
        const index = contacts.findIndex((contact) => contact.id === id);
        if (index === -1) {
            return null;
        }
        contacts[index] = { ...contacts[index], ...updatedContact };
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return contacts[index];
    } catch (error) {
        console.error("Error updating contact:", error);
    }
}