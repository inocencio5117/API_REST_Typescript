import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { string } from 'yup';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: string, required: true, unique: true },
    name: { type: string, required: true },
    password: { type: string, required: true },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  //only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  //random additional data
  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));

  const hash = await bcrypt.hashSync(user.password, salt);

  //replace the password with the hash
  user.password = hash;

  return next();
});

// used for loggin in
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const User = mongoose.model<UserDocument>('user', UserSchema);

export default User;
