const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { TICKET_STATUS, PENDING } = require("../const");
const { USER_ROLE } = require("../const");


const ticketSchema = mongoose.Schema({

    //Assistant FR part
    intitule: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    notes: { type: String },
    delai: { type: Date },
    createdBy: {
        _id: { type: String },
        full_name: { type: String },
        email: { type: String },
        password: { type: String },
        role: { type: String, enum: USER_ROLE }
    },

    etat: { type: String, required: true, default: PENDING, enum: TICKET_STATUS },

    //Assistant DZ part
    remarques: { type: String, default: null },
    filePath: { type: String },
    treatedBy: {
        _id: { type: String },
        full_name: { type: String },
        email: { type: String },
        password: { type: String },
        role: { type: String, enum: USER_ROLE }
    },


});

ticketSchema.plugin(uniqueValidator);

module.exports = mongoose.model("tickets", ticketSchema);





