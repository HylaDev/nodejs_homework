import { Schema, model } from "mongoose";

const variationsSchema = new Schema({
    type: {
        type: String,
        required: true,
        },
    value: {
        type: Number,
        required: true,
    }
});

const Variation = model("Variation", variationsSchema);

export default Variation;
