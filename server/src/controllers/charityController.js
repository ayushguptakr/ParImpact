const Charity = require("../models/Charity");

const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({ charities });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createCharity = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name || !description || !image) {
      return res
        .status(400)
        .json({ message: "name, description, and image are required" });
    }

    const existing = await Charity.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Charity with this name already exists" });
    }

    const charity = await Charity.create({
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
    });

    return res.status(201).json({ message: "Charity created", charity });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const { name, description, image, isActive } = req.body;
    if (name !== undefined) {
      charity.name = String(name).trim();
    }
    if (description !== undefined) {
      charity.description = String(description).trim();
    }
    if (image !== undefined) {
      charity.image = String(image).trim();
    }
    if (isActive !== undefined) {
      charity.isActive = Boolean(isActive);
    }

    await charity.save();

    return res.status(200).json({ message: "Charity updated", charity });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    charity.isActive = false;
    await charity.save();

    return res.status(200).json({ message: "Charity archived" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCharities,
  createCharity,
  updateCharity,
  deleteCharity,
};
