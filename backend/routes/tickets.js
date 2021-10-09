const express = require("express");

const TicketController = require("../controllers/tickets");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, TicketController.createTicket);

router.get("",TicketController.getTickets);

router.get("/:id", checkAuth,TicketController.getTicket);

router.put("/handle/:id", checkAuth, TicketController.handleTicket);

router.put("/resolve/:id", checkAuth, extractFile, TicketController.resolveTicket);

router.post("/ticketFiles/:id",checkAuth,TicketController.downloadFileTicket);


//router.delete("/:id", checkAuth, TicketController.deleteTicket);

module.exports = router;


