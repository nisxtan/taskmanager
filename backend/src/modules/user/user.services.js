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
