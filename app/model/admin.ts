import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, unique: true, trim: true },
    role: { 
        type: String,
        enum: ['admin', 'manager'],
        required: true
    },
    password: String
},
{
    timestamps: true
})

export const adminModel = mongoose.models.admin ||  mongoose.model('admin', AdminSchema);
