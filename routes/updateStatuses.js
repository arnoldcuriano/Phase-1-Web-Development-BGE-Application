const mongoose = require('mongoose');
const Client = require('./models/Client');  // Adjust the path as needed

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const correctStatuses = async () => {
  try {
    // Update all clients with status 'maintainance' to 'maintenance'
    const result = await Client.updateMany(
      { status: 'maintainance' },
      { $set: { status: 'maintenance' } }
    );

    console.log(`${result.nModified} records updated.`);
  } catch (error) {
    console.error('Error updating records:', error);
  } finally {
    mongoose.connection.close();  // Close the connection when done
  }
};

correctStatuses();
