import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
  },
  { 
    timestamps: true,
    toJSON: { 
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Hash password before save
AdminSchema.pre<IAdmin>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    
    // Validate password
    if (this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

AdminSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
