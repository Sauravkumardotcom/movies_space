import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      default: null,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'viewer'],
      default: 'moderator'
    },
    permissions: [
      {
        type: String,
        enum: [
          'manage_users',
          'manage_videos',
          'manage_admins',
          'view_analytics',
          'view_logs',
          'moderate_content',
          'manage_requests'
        ]
      }
    ],
    lastLogin: {
      type: Date,
      default: null
    },
    lastLoginIP: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if admin account is locked
adminSchema.methods.isLocked = function () {
  return this.lockedUntil && this.lockedUntil > Date.now();
};

// Method to get public admin data (exclude sensitive fields)
adminSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockedUntil;
  return obj;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
