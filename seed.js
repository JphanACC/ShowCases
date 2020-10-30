const db = require('./models');
const data = require('./userTestData.json');

db.User.deleteMany({}, (err, deletedUsers) => {
    db.User.create(data.user, (err, seededUsers) => {
        if (err) console.log(err);

        console.log(data.user.length, 'games created successfully');

        process.exit();
    });
});