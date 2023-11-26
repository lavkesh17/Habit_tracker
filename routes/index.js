const express = require("express");
const router = express.Router();

const habitController = require("../controllers/habit_controller");

router.get("/", habitController.home);
router.get("/create", habitController.addHabit);
router.post("/create/habit", habitController.addHabitPost);
router.get("/change", habitController.changeHabitStatus);
router.get("/delete", habitController.deleteHabit);

// default route not working because css is not getting loaded for any other routes if i uncomment the below
//default route
// router.get("/*", (req, res) => {
//   return res.end(`<h1>Page Not Found</h1>
//         <a href="/">Go back home</a>`);
// });

module.exports = router;
