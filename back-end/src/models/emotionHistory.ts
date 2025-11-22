import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmotionHistory extends Document {
  userId: mongoose.Types.ObjectId; 
  emotion: string;                  
  confidence: number;               
  textAnalyzed: string;             
  createdAt: Date;                  
}

const emotionHistorySchema = new Schema<IEmotionHistory>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  emotion: { type: String, required: true },
  confidence: { type: Number, required: true },
  textAnalyzed: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Evita recriação de modelo com nodemon/ts-node
const emotionHistory: Model<IEmotionHistory> =
  mongoose.models.EmotionHistory ||
  mongoose.model<IEmotionHistory>("EmotionHistory", emotionHistorySchema);

export default emotionHistory;
