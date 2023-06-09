const userModel = require("../models/users");
const createOutput = require("../utils").createOutput;
const io = require("./../index")
const utils = require("../utils");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // query a user from the database
    const user = await userModel.findOne({ email });
    if (user) {
      const passwordMatched = await utils.comparePassword(
        password,
        user.password
      );
      if (passwordMatched) {
        return res.json(createOutput(true, { user }));
      } else {
        return res.json(createOutput(false, "Incorrect Password"));
      }
    } else {
      return res.json(createOutput(false, user));
    }
  } catch (error) {
    console.log(error.message);
    return res.json(createOutput(false, error.message, true));
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const saved = await userModel.create({
      email,
      password,
    });
    if (saved) {
      return res.json(createOutput(true, saved));
    } else {
      return res.json(createOutput(false, saved));
    }
  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
};



const allUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.json(createOutput(true, users));
  } catch (error) {
    return res.json(false, error.message, true);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    // querying the user in the database
    const user = await userModel.findById(id);
    const { password, email, username } = req.body;
    if (user) {
      const updated = await userModel.updateOne(
        { email: user.email },
        { password, email, username }
      );
      if (updated) {
        return res.json(createOutput(true, updated));
      } else {
        return res.json(createOutput(true, "failed to update the user"));
      }
    }
    return res.json(createOutput(false, "failed to get user with given id"));
  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
};

const countUsers = async (req, res) => {
  try {
    const allUsersCount = await userModel.find().count();
    if (allUsersCount) {
      return res.json(createOutput(true, allUsersCount));
    } else {
      return res.json(createOutput(false, allUsersCount));
    }
  } catch (error) {
    console.log(error.message);
    return res.json(createOutput(false, error.message, true));
  }
};

const deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const deleted = await userModel.deleteOne({ email });
    if (deleted) {
      return res.json(createOutput(true, deleted));
    } else {
      return res.json(createOutput(false, deleted));
    }
  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
};

const getBalance = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (user) {
      return res.json(createOutput(true, { balance: user.amount, debt: user.debt }));
    } else {
      return res.json(createOutput(true, "No Detail"));
    }

  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
}

const getDebt = async (req, res) => {
  try {
    let debt = req.params.debt;
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (user) {
      if (parseFloat(user.debt) >= 0) {
        debt = (parseFloat(user.debt) + parseFloat(debt)).toString()
        let amouns = (parseFloat(user.amount) + parseFloat(debt)).toString()
        const updated = await userModel.updateOne({ _id: id }, { debt, amount: amouns, tokenId: (user.tokenId + 1) })
        let userSaved = await userModel.findById(id)
        return res.json(createOutput(true, userSaved))
      } else {
        return res.json(createOutput(true, "You can't get  loan"))
      }
    } else {
      return res.json(createOutput(true, "No such user"));
    }

  } catch (error) {
    console.log(error.message);
    return res.json(createOutput(false, error.message, true));
  }
}

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (user) {
      return res.json(createOutput(true, user));
    } else {
      return res.json(createOutput(true, "No such user"));
    }
  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
};


const setAmount = async (req, res) => {
  try {
    const unit = req.params.unit;
    const user = await userModel.findOne();
    if (user) {
      // deduct amount 
      const updated = await userModel.updateOne({ _id: user._id }, { currentUnit: unit })
      if (updated) {
        const savedUser = await userModel.findOne()
        io.Socket.emit("dataSet", savedUser)
        return res.json(createOutput(true, savedUser));
      } else {
        return res.json(createOutput(true, "No such user"));
      }
      return
    } else {
      return res.json(createOutput(true, "No such user"));
    }
  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
}

const setZeroAmount = async (req, res) => {
  try {
    console.log("called");
    const user = await userModel.findOne();
    if (user) {
      const updated = await userModel.updateOne({ _id: user._id }, { amount: "0" })
      if (updated) {
        return res.json(createOutput(true, true));
      } else {
        return res.json(createOutput(true, true));
      }
    } else {
      return res.json(createOutput(true, "No such user"));
    }
  } catch (error) {
    return res.json(createOutput(false, error.message, true));
  }
}

const buyUnits = async (req, res) => {
  try {
    const id = req.params.id;
    let amount = req.params.amount;
    const user = await userModel.findById(id);
    if (user) {
      let debt;
      let amounts = ((parseFloat(user.amount) + parseFloat(amount)) - parseFloat(user.debt))
      if (amounts < 0) {
        // debt = 0 - amount
        // amounts = 0 - amount
        debt = 0 - amounts
        console.log(typeof(amount));
        amounts = 0
        console.log("==>", debt, amounts);
        let updated = await userModel.updateOne({ _id: id }, { amount: amounts.toString(), debt: debt.toString() })
        if (updated) {
          let updatedUser = await userModel.findById(id)
          return res.json(createOutput(true, updatedUser))
        } else {
          return res.json(createOutput(false, 'failed'))
        }
      }
      if (amounts >= 0) {
        // deni limeisha
        debt = 0;
        console.log("==>", debt, amounts);
        let updated = await userModel.updateOne({ _id: id }, { amount: amounts.toString(), debt: (debt).toString(), tokenId: (user.tokenId + 1) })
        if (updated) {
          let updatedUser = await userModel.findById(id)
          return res.json(createOutput(true, updatedUser))
        } else {
          return res.json(createOutput(false, 'failed'))
        }
      }


    } else {
      return res.json(createOutput(true, "No such user"));
    }
  } catch (error) {
    console.log(error);
    return res.json(createOutput(false, error.message, true));
  }
}
module.exports = {
  allUsers,
  login,
  deleteUser,
  updateUser,
  register,
  getUserById,
  getBalance,
  countUsers,
  getDebt,
  buyUnits,
  setAmount,
  setZeroAmount
};
