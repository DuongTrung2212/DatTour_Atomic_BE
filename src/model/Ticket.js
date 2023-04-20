const mongoose = require("mongoose");
const Tour = require("./TourModel");
const Schema = mongoose.Schema;
const TicketSchema = new Schema({
    MaTicket: {
        type: Schema.ObjectId,
        unique: true,
        default: new mongoose.Types.ObjectId(),
    },
    Tour: {
        type: Object,
    },
    DatTour: {
        type: Object,
    },
});

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
