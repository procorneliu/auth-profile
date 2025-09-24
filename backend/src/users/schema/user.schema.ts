import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
}) // with auto creation of createdAt & updatedAt | __v disabled
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String })
  avatarUrl: string;

  @Prop({ type: String, select: false })
  refresh_token: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre SAVE middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next;
  }
  const salt = 12;

  this.password = await bcrypt.hash(this.password, salt);

  if (this.refresh_token)
    this.refresh_token = await bcrypt.hash(this.refresh_token, salt);

  next();
});

// Hash when sensitive field are updated
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as any;
  const salt = 12;

  if (update.password)
    update.password = await bcrypt.hash(update.password, salt);

  if (update.refresh_token)
    update.refresh_token = await bcrypt.hash(update.refresh_token, salt);

  this.setUpdate(update);
  next();
});
