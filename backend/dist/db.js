import mongoose, { Schema, model } from "mongoose";
const { ObjectId } = mongoose.Types;
import dotenv from "dotenv";
dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const contentTypes = ['youtube', 'twitter', 'notion'];
const contentSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    tags: [{ type: ObjectId, ref: 'tags' }],
    userId: { type: ObjectId, ref: 'users', required: true }
});
const tagSchema = new Schema({
    title: { type: String, required: true, unique: true },
});
const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: 'users', required: true, unique: true }
});
export const UserModel = model("users", userSchema);
export const ContentModel = model("content", contentSchema);
export const TagsModel = model("tags", tagSchema);
export const LinkModel = model("link", linkSchema);
//# sourceMappingURL=db.js.map