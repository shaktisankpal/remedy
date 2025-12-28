const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "ASSIGNED_L1",
        "IN_PROGRESS_L1",
        "ESCALATED_TO_L2",
        "IN_PROGRESS_L2",
        "RESOLVED",
        "REOPENED",
        "CLOSED",
      ],
      default: "OPEN",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedL1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedL2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },

    history: [
      {
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
