const Habit = require("../models/habit_schema");
module.exports.home = async function (req, res) {
  // if we are not using any template engine, we will call the html file like below
  //return res.sendFile("home.html", { root: "./views" });

  let dateArr = [];

  //months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  //dates to be displayed ( 6 previous days )
  for (let i = 6; i >= 0; i--) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    let dateObj = {
      dateString: d.toDateString(),
      date: d.getDate(),
      month: months[d.getMonth()],
      year: d.getFullYear(),
    };
    dateArr.push(dateObj);
  }

  let completedArr = [];

  //get all Habits
  let habits = await Habit.find({});

  //find if the dates for each habit is completed or not and put them in the completed array
  for (let j = 0; j < habits.length; j++) {
    let getHabit = await Habit.findById(habits[j].id);
    completedArr[j] = [];
    for (let i = 0; i <= 6; i++) {
      let found = getHabit.daily_habit.find(
        (e) => e.date == dateArr[i].dateString
      );
      if (found) {
        let completedResult = "";
        if (found.completed == "") {
          completedResult = "None";
        } else if (found.completed == "Yes") {
          completedResult = "Yes";
        } else {
          completedResult = "No";
        }
        completedArr[j][i] = {
          id: found.id,
          completed: completedResult,
        };
      } else {
        let dailyHabit = getHabit.daily_habit.push({
          date: dateArr[i].dateString,
          completed: "",
        });
        await getHabit.save();
        completedArr[j][i] = {
          id: getHabit.daily_habit[dailyHabit - 1].id,
          completed: "None",
        };
      }
    }
  }
  return res.render("home", {
    title: "Habit Tracker",
    habits: habits,
    dates: dateArr,
    completed: completedArr,
  });
};

module.exports.addHabit = function (req, res) {
  return res.render("addHabit", { title: "Add Habit" });
};

module.exports.deleteHabit = function (req, res) {
  Habit.findByIdAndDelete(req.query.habit_id)
    .then((result) => {
      return res.redirect("/");
    })
    .catch((err) => {
      console.log("could not delete", err);
      return;
    });
};

module.exports.addHabitPost = async function (req, res) {
  //try{
  let habit = await Habit.create({ ...req.body });
  habit.save().catch((err) => {
    console.log("Error in saving habit to db ", err);
  });
  //}
  return res.redirect("/");
};

module.exports.changeHabitStatus = async function (req, res) {
  let habit = await Habit.findById(req.query.habit_id);
  if (habit.daily_habit.id(req.query.dailyHabit).completed == "") {
    habit.daily_habit.id(req.query.dailyHabit).completed = "Yes";
  } else if (habit.daily_habit.id(req.query.dailyHabit).completed == "Yes") {
    habit.daily_habit.id(req.query.dailyHabit).completed = "No";
  } else {
    habit.daily_habit.id(req.query.dailyHabit).completed = "";
  }
  habit.save().catch((err) => {
    console.log("Error in saving");
  });
  return res.redirect("/");
};
