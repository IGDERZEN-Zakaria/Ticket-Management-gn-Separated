const { ASSISTANT_FR, FINISHED, ASSISTANT_DZ, IN_PROGRESS, PENDING } = require("../const");
const Ticket = require("../models/ticket");
const user = require("../models/user");
var path = require('path');



//Done exclusively by assistant FR

exports.createTicket = async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    // if (req.userData != ASSISTANT_FR) {
    //     res.status(401).json({ message: "Not authorized!" });
    // }
    const ticket = new Ticket({
        intitule: req.body.intitule,
        description: req.body.description,
        notes: req.body.notes,
        delai: req.body.delai,
        etat: PENDING,
    });

    const existingUser = await user.findOne({ _id: req.userData.userId }).lean();
    if (!existingUser) {
        res.status(200).json({ message: "User does not exist !" });

    }
    ticket.createdBy = {
        full_name: existingUser.full_name,
        _id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email
    }


    ticket
        .save()
        .then(createdTicket => {
            res.status(201).json({
                message: "Ticket added successfully",
                ticket: {
                    ...createdTicket,
                    id: createdTicket._id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Creating a Ticket failed!"
            });
        });
};


exports.handleTicket = async (req, res, next) => {

    const existingUser = await user.findOne({ _id: req.userData.userId }).lean();
    if (!existingUser) {
        return res.status(200).json({ message: "User does not exist !" });

    }

    if (existingUser.role != ASSISTANT_DZ) {
        return res.status(401).json({ message: "Not authorized!" });
    }


    let existingTicket = await Ticket.findOne({ _id: req.params.id }).lean();
    if (!existingTicket) {
        res.status(200).json({ message: "Ticket does not exist !" });
        if (reservedTicket.treatedBy != null) {
            res.status(200).json({ message: "This Ticket is already taken by another user !" });
        }
    }


    let savedTicket = existingTicket;

    savedTicket.etat = IN_PROGRESS;
    savedTicket.treatedBy = {
        full_name: existingUser.full_name,
        _id: req.userData.userId,
        role: existingUser.role,
        email: existingUser.email
    }
    savedTicket._id = existingTicket._id;



    let finalTicket = await Ticket.updateOne({ _id:  req.params.id },savedTicket);
    if (!finalTicket) {
        res.status(500).json({message: "Couldn't Reserve Ticket!"});
    }
    else {
        res.status(200).json({ message: "Ticket Reserved successfully !" });
    }

};


exports.resolveTicket = async (req, res, next) => {
    let filePath = req.body.filePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        filePath = url + "/ticketFiles/" + req.file.filename;
    }

    const existingUser = await user.findOne({ _id: req.userData.userId }).lean();
    if (!existingUser) {
        return res.status(200).json({ message: "User does not exist !" });
    }

    if (existingUser.role != ASSISTANT_DZ) {
        return res.status(401).json({ message: "Not authorized!" });
    }


    const existingTicket = await Ticket.findOne({ _id: req.params.id }).lean();
    if (!existingTicket) {
        res.status(200).json({ message: "Ticket does not exist !" });
    }

    let savedTicket = existingTicket;

    savedTicket.remarques = req.body.remarques,
    savedTicket.filePath = filePath,
    savedTicket.etat = FINISHED
    savedTicket._id = existingTicket._id;
    
    
    
        let finalTicket = await Ticket.updateOne({ _id:  req.params.id },savedTicket);
        if (!finalTicket) {
            res.status(500).json({message: "Couldn't resolve Ticket!"});
        }
        else {
            res.status(200).json({ message: "Ticket Resolved successfully !" });
        }

};

exports.getTickets = (req, res, next) => {
    //const etatFilter = req.body.selectedEtat;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    etatSelection = req.query.etatSelection;

    let ticketQuery = {};

    let count;

    if (etatSelection != 'ALL') {
        ticketQuery = Ticket.find({ etat: etatSelection });
        count = Ticket.find({ etat: etatSelection }).count();
    }
    else {
        ticketQuery = Ticket.find();
        count = Ticket.count();

    }

    let fetchedTickets;
    if (pageSize && currentPage) {
        ticketQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    ticketQuery
        .then(documents => {
            fetchedTickets = documents;

            return count;
        })
        .then(count => {
            res.status(200).json({
                message: "Tickets fetched successfully!",
                tickets: fetchedTickets,
                maxTickets: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching Tickets failed!"
            });
        });
};

exports.getTicket = (req, res, next) => {

    Ticket.findById(req.params.id)
        .then(ticket => {
            if (ticket) {
                res.status(200).json(ticket);
            } else {
                res.status(404).json({ message: "ticket not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching ticket failed!"
            });
        });
};


exports.downloadFileTicket = async (req, res, next) => {
    const existingUser = await user.findOne({ _id: req.userData.userId }).lean();
    if (!existingUser) {
        return res.status(200).json({ message: "User does not exist !" });
    }

    if (existingUser.role != ASSISTANT_FR) {
        return res.status(401).json({ message: "Not authorized!" });
    }

    const existingTicket = await Ticket.findOne({ _id: req.params.id });
    if (!existingTicket) {
        res.status(200).json({ message: "Ticket does not exist !" });
    }

    let filePath = path.join(__dirname, '../ticketFiles/') + req.body.fileName;
    res.status(200).sendFile(filePath);

};


