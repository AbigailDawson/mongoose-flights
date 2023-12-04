const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
  index,
  new: addNew,
  create,
  show,
};

async function index(req, res) {
  const flights = await Flight.find({});
  res.render('flights/index', { title: 'All Flights', flights });
}

function addNew(req, res) {
  const newFlight = new Flight();
  // Obtain the default date
  const dt = newFlight.departs;
  // Format the date for the value attribute of the input
  let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
  departsDate += `-${dt.getDate().toString().padStart(2, '0')}T${dt.toTimeString().slice(0, 5)}`;

  res.render('flights/new', {
    departsDate,
    title: 'Add Flight',
    errorMsg: ''
  })
}

async function create(req, res) {
  console.log('REQ.BODY: ', req.body)
  // Remove empty properties so that defaults will be applied
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  try {
    await Flight.create(req.body);
    // Always redirect after CUDing data
    res.redirect('/flights'); 
  } catch (err) {
    // Typically some sort of validation error
    console.log(err);
    res.render('flights/new', { errorMsg: err.message });
  }
}

async function show(req, res) {

  const flight = await Flight.findById(req.params.id);
  const tickets = await Ticket.find({ flight: flight._id });

  console.log('FLIGHT: ', flight)
  console.log('TICKETS: ', tickets)

  res.render('flights/show', { 
    title: 'Flight Detail', 
    flight,
    tickets
   });
}