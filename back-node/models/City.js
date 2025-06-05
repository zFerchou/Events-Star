// models/City.js
import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la ciudad es obligatorio."],
      trim: true,
      unique: true,
      maxLength: [50, "El nombre no puede exceder 50 caracteres."]
    },
    country: {
      type: String,
      required: [true, "El país es obligatorio."],
      trim: true
    },
    // Opcional: coordenadas geográficas
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

const City = mongoose.model("City", citySchema);
export default City;