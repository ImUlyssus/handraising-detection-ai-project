import mongoose from 'mongoose';

const oneClassHistorySchema = mongoose.Schema(
    {
      oneClassId: {
        type: String,
        required: true,
      },
      studentPhotos: [
        {
          data: { type: Buffer, required: true },
          contentType: { type: String, required: true },
        },
      ],
    },
    {
      timestamps: true,
    }
  );
  
  export const OneClassHistory = mongoose.model('OneClassHistory', oneClassHistorySchema);