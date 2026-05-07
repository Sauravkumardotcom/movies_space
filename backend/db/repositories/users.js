import prisma from '../connection.js';

const USER_SELECTION = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  avatar: true,
  bio: true,
  role: true,
  isVerified: true,
  lastLogin: true,
  isActive: true,
  preferences: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { ...USER_SELECTION, password: true }
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: USER_SELECTION
  });
};

export const insertUser = async ({ email, password, username = null, firstName = null, lastName = null, role = 'user' }) => {
  return await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password,
      username,
      firstName,
      lastName,
      role: role.toUpperCase()
    },
    select: USER_SELECTION
  });
};

export const updateLastLogin = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() }
  });
};

export const getAdminByEmail = async (email) => {
  return await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      role: 'ADMIN'
    },
    select: { ...USER_SELECTION, password: true }
  });
};
