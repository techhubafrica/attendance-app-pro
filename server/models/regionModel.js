import mongoose from "mongoose";

const regionSchema = mongoose.Schema({
  regionName: { type: String, required: true, unique: true },
  capital: { type: String, required: true, unique: true},
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  roboticsLabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoboticsLab" }], // Reference to robotics labs
});

export default mongoose.model("Region", regionSchema);
