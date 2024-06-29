const Client = require("../models/Client");
const { getDB } = require("../db");
const ObjectId = require("mongodb").ObjectId;

const clientsCollection = getDB().collection(process.env.NODE_ENV === 'production' ? "clients" : "clients_dev");

exports.apiCreateClient = function(req, res) {
    let client = new Client(req.body);
    client.create()
        .then((result) => {
            res.status(201).json({ message: "Client added successfully", id: result._id });
        })
        .catch(errors => {
            res.status(500).json({ error: "Failed to create client", details: errors });
        });
}

exports.apiGetAllClients = function(req, res) {
    clientsCollection.find().toArray()
        .then(clients => {
            res.status(200).json(clients);
        })
        .catch(errors => {
            res.status(500).json({ error: "Failed to retrieve clients", details: errors });
        });
}

exports.apiViewSingleClient = async function(req, res) {
    try {
        const client = await clientsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!client) {
            res.status(404).json({ message: 'Client not found' });
        } else {
            res.status(200).json(client);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to find client", details: error.message });
    }
}

exports.apiUpdateClient = async function(req, res) {
    let clientId = new ObjectId(req.params.id);
    try {
        let client = await clientsCollection.findOneAndUpdate({ _id: clientId }, { $set: req.body }, { returnOriginal: false });
        if (!client.value) {
            res.status(404).json({ message: "Client not found" });
        } else {
            res.status(200).json({ message: "Client updated successfully", client: client.value });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update client", details: error.message });
    }
}

exports.apiDeleteClient = async function(req, res) {
    try {
        const result = await clientsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount == 0) {
            res.status(404).json({ message: "Client not found" });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete client", details: error.message });
    }
}
