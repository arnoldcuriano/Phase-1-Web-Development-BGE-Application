const Department = require('../models/Department');

exports.updateDepartment = async (req, res) => {
  try {
    const { id, name, head } = req.body;
    await Department.findByIdAndUpdate(id, { name, head });
    res.status(200).send('Department updated successfully');
  } catch (error) {
    res.status(500).send('Error updating department');
  }
};
