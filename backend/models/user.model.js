import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: [6, "Senha deve ter pelo menos 6 caracteres."],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  //this puts the 'created/updated at' to the user object
  {
    timestamps: true,
  }
);

//a presave hook to hash password before sending to database. Happens before .save()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//compares the password the user is sending to the one already hashed in database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//makes the model "User" and uses userSchema as reference of object user
//pelo nome ser User, o mongodb cria uma coleção chamada users. Ele pluraliza
const User = mongoose.model("User", userSchema);

export default User;
