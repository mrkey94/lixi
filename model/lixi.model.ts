import mongoose from "mongoose";

export interface Lixis extends mongoose.Document {
  from: number;
  to: number;
  account: string[];
}

const LixiSchema = new mongoose.Schema<Lixis>({
  from: {
    type: Number,
    required: [true, "Please provide the amount range"],
    max: [500, "Amount range cannot be more than 500"],
    min: [10, "Amount range cannot be less than 10"],
  },
  to: {
    type: Number,
    required: [true, "Please provide the amount range"],
    max: [500, "Amount range cannot be more than 500"],
    min: [20, "Amount range cannot be less than 10"],
  },
  account: {
    type: [String],
  },
});

const Lixis = mongoose.models.Lixis || mongoose.model("Lixis", LixiSchema);
export default Lixis;
