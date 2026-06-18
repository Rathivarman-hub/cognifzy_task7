import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  avatar: { type: String },
  provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
  providerId: { type: String },
  apiUsage: {
    weather: { type: Number, default: 0 },
    news: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    provider: this.provider,
    apiUsage: this.apiUsage,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
