const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });

};

const getJob = async (req, res, next) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId }).select("-createdBy");
  if (!job) {
    throw new NotFoundError(`No jo wth ID ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job, createdBy: req.user.name })
};

const createJob = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    job: job,
    createdBy: req.user.name,
  })
};

const updateeJob = async (req, res,) => {
  const { user: { userId }, params: { id: jobId } } = req;
  const { company, position } = req.body;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true }
  )
  if (!job) {
  throw new NotFoundError(`No job with ID ${jobId}`)
  };
  res.status(StatusCodes.OK).json({job})

};

const deleteJob = async (req, res, next) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with ID ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateeJob,
  deleteJob,
};
