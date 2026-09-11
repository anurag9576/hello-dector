const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hello-doctor')
  .then(() => {
    const bookAppointmentSchema = new mongoose.Schema({}, { strict: false });
    const BookAppointment = mongoose.model('BookAppointment', bookAppointmentSchema, 'bookappointments');
    
    return BookAppointment.find({});
  })
  .then(res => {
    console.log("Appointments:");
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
