import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "El nombre debe tener al menos 2 caracteres."]
        },
        lastN: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "El apellido debe tener al menos 2 caracteres."]
        },
        pass: {
            type: String,
            required: true,
            trim: true,
            minLength: [6, "La contraseña debe tener al menos 6 caracteres."]
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, "Email no válido"]
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[+][(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]$/, "Teléfono no válido"]
        },
        token: {
            type: String
        },
        confirm: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: 'Cliente',
            enum: ['Cliente', '4DMlN']
        },
        otp: {
            type: String,
            default: null
        },
        otpExpires: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;

// verificacionn de A07
//Verificación de Injecciones A03