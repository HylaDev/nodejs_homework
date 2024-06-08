import { Schema, model } from "mongoose";

const variationsSchema = new Schema({
    temperature: {
        type: Int,
        required: true,
        },
    humidity: {
        type: Int,
        required: true,
    }
});

const Variation = model("Variation", usersSchema);

export default Variation;
