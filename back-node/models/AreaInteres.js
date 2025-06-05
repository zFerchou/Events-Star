import mongoose from "mongoose";

const areaInteresSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del área es obligatorio."],
      trim: true,
      unique: true, // Evita duplicados
      maxLength: [50, "El nombre no puede exceder 50 caracteres."],
    }
    
  },
  { timestamps: true }
);

const AreaInteres = mongoose.model("AreaInteres", areaInteresSchema);


export default AreaInteres;