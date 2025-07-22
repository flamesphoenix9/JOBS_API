const getAllJobs = async (req, res, next) => {
  res.send("getAllJobs");
};

const getJob = async (req, res, next) => {
  res.send("getJob");
};

const createJob = async (req, res, next) => {
  res.send("createJob");
};

const updateeJob = async (req, res, next) => {
  res.send("updateJob");
};

const deleteJob = async (req, res, next) => {
  res.send("deleteJob");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateeJob,
  deleteJob,
};
