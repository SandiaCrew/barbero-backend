const mongodb = require('mongodb');
const clientsCollection = require('../db').db().collection("clients");
const qrcode = require('qrcode');


let Client = function(data) {
    this.data = data;
    this.errors = [];
}

Client.prototype.cleanUp = function() {
    if (typeof(this.data.name) != "string") { this.data.name = ""; }
    if (typeof(this.data.email) != "string") { this.data.email = ""; }
    if (typeof(this.data.phone) != "string") { this.data.phone = ""; }

    // Overwrite with clean data
    this.data = {
        name: this.data.name.trim(),
        email: this.data.email.trim().toLowerCase(),
        phone: this.data.phone.trim()
    };
}

Client.prototype.validate = function() {
    if (this.data.name == "") { this.errors.push("You must provide a name."); }
    if (this.data.email == "" || !this.data.email.includes("@")) { this.errors.push("You must provide a valid email address."); }
    if (this.data.phone == "") { this.errors.push("You must provide a phone number."); }
}

Client.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        this.validate();
        if (!this.errors.length) {
            try {
                // Generate QR Code first using a placeholder or another unique identifier if _id is not yet available
                const placeholderId = new mongodb.ObjectId(); // Generate a temporary unique ID for QR code generation
                const qrCodeData = await qrcode.toDataURL(placeholderId.toString());

                // Attach QR code data to the client object
                this.data.qrCode = qrCodeData;

                // Then, insert the client data into the database, including the QR code
                const result = await clientsCollection.insertOne(this.data);

                // Attach the actual _id from the database to the client object
                this.data._id = result.insertedId;

                resolve(this.data);  // Resolve with the full data object, including the QR Code
            } catch (e) {
                this.errors.push("Database error: " + e);
                reject(this.errors);
            }
        } else {
            reject(this.errors);
        }
    });
}




Client.findAll = function() {
    return clientsCollection.find().toArray();
}

module.exports = Client;
