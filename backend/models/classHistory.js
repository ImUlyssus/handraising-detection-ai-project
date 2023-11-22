import mongoose from 'mongoose';

// Model for ClassHistory
const classHistorySchema = mongoose.Schema(
  {
    classId: {
      type: String,
      required: true,
    },
    dates: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ClassHistory = mongoose.model('ClassHistory', classHistorySchema);