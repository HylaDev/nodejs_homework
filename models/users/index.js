import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
        },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = model("User", usersSchema);

export default User;
