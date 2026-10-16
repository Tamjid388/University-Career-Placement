import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generatetoken.js";

export const registerWithFirebase = async ({ email, password, fullname, role }) => {
  // Lazy-loaded: firebaseconfig.js reads the gitignored service-account file
  // at import time, so only load it on the path that actually needs Firebase.
  const { default: admin } = await import("../config/firebaseconfig.js");
  const firebaseUser = await admin.auth().createUser({
    email,
    password,
    displayName: fullname,
  });
  const newUser = await User.create({
    name: fullname,
    email,
    role: role || "job-seeker",
    provider: "firebase",
    providerId: firebaseUser.uid,
  });
  return newUser;
};

export const googleLogin = async ({ name, email }) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, role: "job-seeker", password: null });
    await user.save();
  }
  const token = generateToken(user);
  return { user, token };
};
