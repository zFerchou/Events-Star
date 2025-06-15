import mongoose from "mongoose";

const eventtSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required."],
      trim: true,
      maxLength: [100, "Event name cannot exceed 100 characters."],
    },
    maxCapacity: {
      type: Number,
      required: [true, "Maximum capacity is required."],
      min: [1, "Capacity must be at least 1."],
    },
    date: {
      type: Date,
      required: [true, "Event date is required."],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Event date must be in the future.",
      },
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [false, "La ciudad es obligatoria."],
    },
    areaInteres: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AreaInteres",
      required: [false, "El área es obligatoria."],
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria."],
    },
    published: {
      type: Boolean,
      default: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        validate: {
          validator: async function (userId) {
            const user = await mongoose.model("Usuario").findById(userId);
            return user !== null;
          },
          message: "User does not exist.",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El creador del evento es obligatorio."],
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

eventtSchema.pre("save", function (next) {
  if (this.participants.length > this.maxCapacity) {
    throw new Error("Participants exceed maximum capacity.");
  }
  next();
});

eventtSchema.index({ eventName: 1 });

const Eventt = mongoose.model("Eventt", eventtSchema);

export default Eventt;
