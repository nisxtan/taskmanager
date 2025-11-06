// const { where } = require("sequelize");
// const AppDataSource = require("../../config/database");
const User = require("../../entity/User");
const bcrypt = require("bcryptjs");

module.exports.createUser = async (AppDataSource, userData) => {
  const userRepo = AppDataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = userRepo.create({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
  });

  await userRepo.save(newUser);
  return newUser;
};

//find one user by email
module.exports.findUserByEmail = async (AppDataSource, email) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email } });
  return user;
};

//find user by username
module.exports.findUserByUsername = async (AppDataSource, username) => {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { username } });
};

//compare passwords
module.exports.comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

//get all users
module.exports.getAllUsers = async (AppDataSource) => {
  const userRepo = AppDataSource.getRepository(User);
  const userList = await userRepo.find();
  return userList;
};

//update user
module.exports.updateUser = async (AppDataSource, id, newDetails) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id } });

  if (!user) {
    throw { code: 404, message: "User not found" };
  }
  if (newDetails.password) {
    newDetails.password = await bcrypt.hash(newDetails.password, 10);
  }
  await userRepo.update(id, newDetails); //this line does not return, only updates
  const updatedUser = await userRepo.findOne({ where: { id } });
  return updatedUser;
};

//delete user
module.exports.deleteUser = async (AppDataSource, id) => {
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { id } });
  if (!user) {
    throw {
      code: 404,
      message: "User not found.",
    };
  }
  await userRepo.remove(user);
  return user;
};
