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
          return value > new Date(); // Fecha debe ser futura
        },
        message: "Event date must be in the future.",
      },
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [false, "La ciudad es obligatoria."]
    },
    areaInteres: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AreaInteres", // Referencia al modelo Area
      required: [false, "El área es obligatoria."],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // Referencia al modelo de Usuario
        validate: {
          validator: async function (userId) {
            const user = await mongoose.model("Usuario").findById(userId);
            return user !== null; // Verifica si el usuario existe
          },
          message: "User does not exist.",
        },
      },
    ],
  },
  {
    timestamps: true, // Crea campos `createdAt` y `updatedAt`
  }
);

// Validación adicional para no exceder el cupo máximo
eventtSchema.pre("save", function (next) {
  if (this.participants.length > this.maxCapacity) {
    throw new Error("Participants exceed maximum capacity.");
  }
  next();
});

eventtSchema.index({ eventName: 1 });

const Eventt = mongoose.model("Eventt", eventtSchema);

export default Eventt;