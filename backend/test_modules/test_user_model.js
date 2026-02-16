require('dotenv').config();

const {
  createUser,
  findUserByEmail,
  findUserById,
  getAllEmployees
} = require('./src/models/user.model');

const { pool } = require('./src/config/database');

(async () => {
  try {
    console.log("===== TEST: CREATE USER =====");

    const user = await createUser(
      "modeltest@test.com",
      "hashedpassword",
      "Model Test",
      "employee"
    );

    console.log("Created User:", user);

    console.log("\n===== TEST: FIND BY EMAIL =====");
    const found = await findUserByEmail("modeltest@test.com");
    console.log("Found User:", found);

    console.log("\n===== TEST: FIND BY ID =====");
    const byId = await findUserById(user.id);
    console.log("Found By ID:", byId);

    console.log("\n===== TEST: GET ALL EMPLOYEES =====");
    const employees = await getAllEmployees();
    console.log("Employees Count:", employees.length);

    console.log("\n===== TEST: DUPLICATE EMAIL =====");
    try {
      await createUser(
        "modeltest@test.com",
        "hashedpassword",
        "Duplicate",
        "employee"
      );
    } catch (err) {
      console.log("Duplicate handled:", err.message);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
})();
