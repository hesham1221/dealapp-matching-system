import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "CLIENT", "AGENT"], required: true },
  status: { type: String, enum: ["ACTIVE", "DELETED"], required: true },
});

userSchema.plugin(mongoosePaginate);

export default mongoose.model("User", userSchema);
