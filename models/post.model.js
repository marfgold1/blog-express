import mongoose from 'mongoose';
const { model, Schema } = mongoose;

export default model("Posts", new Schema({
    slug: { type: String, unique: true, index: true, required: true,
        validate: {
            validator: function(v) {
                const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
                return regex.test(v)
            },
            message: "Invalid slug."
        } },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }
}, { timestamps: true }));
