const Member = require('../models/Member');
const ITEMS_PER_PAGE = 10;

exports.getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalMembers = await Member.countDocuments();
    const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);

    const members = await Member.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('members', {
      members: members,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Error fetching members');
  }
};

exports.addMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Error adding member' });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Error updating member' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Error deleting member' });
  }
};