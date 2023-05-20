import * as mongoose from "mongoose"
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
          },
          email: {
            type: String,
            required: true,
            unique: true
          },
          password: {
            type: String,
            required: true
          },
          firstName: String,
          lastName: String,
          bio: String,
          profilePicture: String,
          recipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
          }],
          favorites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
          }]
    },
    { timestamps: true }
)

UserSchema.pre('save', async function (next: any) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});

export interface User extends mongoose.Document {
    _id: string;
    password: string;
    email: string;
    country: string;
}