import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // create a new user and save to db
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);
    res.status(201).json({ message: "User created successfullyo(*°▽°*)o" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user! (˘･_･˘)" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //check if the user exists already
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user)
      return res.status(401).json({ message: "Invalid Credentials! ಠಿ_ಠ" });

    // check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials! ಠಿ_ಠ" });

    // generate cpookie token and send it to the user
    // res.setHeader('Set-Cookie',"test=" + "myValue").json("successfully logged in (*°▽°*)");
    const age = 1000 * 60 * 60 * 24;
    res
      .cookie("test2", "myValue2", {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "Successfully logged in (*°▽°*)" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login (¬_¬;)" });
  }
};

export const logout = (req, res) => {
  // db operations
};
