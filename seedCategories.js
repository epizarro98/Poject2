const db = require("./models");

let names = [
  "Uncategorized",
  "Bills",
  "Letters",
  "Junk Mail",
  "School",
  "Holiday Cards",
  "Invitations",
  "Gift Cards",
  "Packages",
];

names.forEach((name) => {
  db.category
    .create({ categoryName: name })
    .then((category) => {
      console.log(`🤡 created category ${category.categoryName}`);
    })
    .catch((err) => {
      console.log("😠");
      console.log(err);
    });
});
