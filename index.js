const express=require('express');
const fs = require('fs');
const mysql=require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8080;
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Phone321",
    database: "project_db"
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log("Connected to MySQL!");
});
// Variable to store username
let loggedInUsername = '';
let checkIfFamilyAlreadyRigestered = 0
let checkIfUserAlreadyVoted = 0;
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});
// Serve signup.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});
// Handle signup form submission
app.post('/signup', (req, res) => {
    const { username, password, role, fullname, email, phone } = req.body;
    var saim=role.toLowerCase();
    if (saim !== 'student' && saim !== 'teacher') {
        res.status(400).send('Role must be either "student" or "teacher"');
        return;
    }
    const sql = `INSERT INTO Users (UserID, UserPassword, UserRole, FullName, Email, PhoneNo) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [username, password, role, fullname, email, phone], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).send('Error registering user');
            return;
        }
        console.log("User registered successfully");
        res.redirect('/');
    });
});
app.use(bodyParser.urlencoded({ extended: true }))
// Serve login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});
// Set EJS as the view engine
//app.set('view engine', 'ejs');
// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT UserID, UserRole FROM Users WHERE UserID = ? AND UserPassword = ?`;
    connection.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Error logging in');
            return;
        }
        if (results.length === 1) {
            console.log("Login successful");
            const { UserID, UserRole } = results[0];
            if (UserRole === 'admin') {
                res.redirect('adminpage');
            } else if (UserRole === 'Teacher') {
                // Save username to variable
                loggedInUsername = username;
                // Redirect to mainpage
                res.redirect('mainpage');
            } else {
                console.log("Student ID:", UserID);
                // Save username to variable
                loggedInUsername = username;
                // Redirect to mainpage
                res.redirect('mainpage');
            }
            const sql = `SELECT * FROM familymembers WHERE UserID = ?`;
            connection.query(sql, [username], (err, results) => {
                if(results.length > 0){
                    checkIfFamilyAlreadyRigestered = 1;
                }
            });
            const sql2 = `SELECT * FROM menu_suggest WHERE UserID = ?`;
            connection.query(sql2, [username], (err, results) => {
                if(results.length > 0){
                    checkIfUserAlreadyVoted  = 1;
                    console.log('checkIfUserAlreadyVoted', checkIfUserAlreadyVoted)
                }
            });
        } else {
            console.log("Invalid username or password");
            res.status(401).send('Invalid username or password');
        }
    });
});
app.get('/mainpage', (req, res) => {
    const username = loggedInUsername;

    const htmlFilePath = path.join(__dirname, 'public/index.html');
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const processedHtml = htmlContent.replace('<%= username %>', username);

    res.send(processedHtml);
});

app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Serve family registration page (familyregistration.html)
app.get('/familyregistration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/familyregister.html'));
});

// Handle family registration form submission
app.post('/familyregistration', (req, res) => {
    const { numberOfMembers } = req.body;

    // Insert family data into FamilyMembers table
    const familyInsertQuery = `INSERT INTO FamilyMembers (UserID, No_of_member) VALUES (?, ?)`;
    connection.query(familyInsertQuery, [loggedInUsername, numberOfMembers], (familyInsertError, familyInsertResult) => {
        if (familyInsertError) {
            console.error('Error inserting family data into database:', familyInsertError);
            return res.status(500).send('Error registering family members');
        }

        const familyMemberID = familyInsertResult.insertId;

        // Insert family member names into FamilyMemberNames table
        for (let i = 1; i <= numberOfMembers; i++) {
            const memberName = req.body[`familyMember${i}`];
            const memberInsertQuery = `INSERT INTO FamilyMemberNames (FamilyMemberID, Name) VALUES (?, ?)`;
            connection.query(memberInsertQuery, [familyMemberID, memberName], (memberInsertError, memberInsertResult) => {
                if (memberInsertError) {
                    console.error('Error inserting family member name into database:', memberInsertError);
                    return res.status(500).send('Error registering family members');
                }
                console.log(`Family member ${i} inserted successfully`);
            });
        }

        // Update the variable to indicate family registration
        checkIfFamilyAlreadyRigestered = 1;

        console.log("Family members registered successfully");
        res.redirect('/mainpage');
    });
});


// Serve vote.html
app.get('/vote', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/vote.html'));
});

// Handle form submission
app.post('/submit-menu', (req, res) => {
    const selectedItems = req.body.items;

    // Increment votes for selected items in the database
    const updateVotesQuery = `UPDATE MenuItems SET Votes = Votes + 1 WHERE MenuItemID IN (?)`;
    connection.query(updateVotesQuery, [selectedItems], (err, result) => {
        if (err) {
            console.error('Error updating votes:', err);
            return res.status(500).send('Error updating votes');
        }
        
        // Insert selected items into menu_suggest table
        const userId = loggedInUsername;
        const insertSuggestionQuery = `INSERT INTO menu_suggest (UserID, MenuItemID) VALUES ?`;
        const values = selectedItems.map(itemId => [userId, itemId]);
        
        connection.query(insertSuggestionQuery, [values], (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error inserting suggestions:', insertErr);
                return res.status(500).send('Error inserting suggestions');
            }
            console.log("Suggestions inserted successfully");
            res.redirect('/mainpage');
        });
    });
});

app.get('/menu-items', (req, res) => {
    const fetchItemsQuery = `SELECT MenuItemID, ItemName FROM MenuItems`;
    connection.query(fetchItemsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching menu items:', err);
            return res.status(500).send('Error fetching menu items');
        }
        res.json(results); 
    });
});

// Serve menu suggest page
app.get('/suggest-menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/suggest_menu.html'));
});

// Serve Proposal suggest page
app.get('/performanec-proposals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/performanceProposals.html'));
});

// Handle form submission for suggesting a menu item
app.post('/suggest-menu', (req, res) => {
    const { dishName } = req.body;

    // Insert the dish into the MenuItems table with default values for price and quantity
    const insertDishQuery = `INSERT INTO MenuItems (ItemName, Votes, Price, Quantity) VALUES (?, 0, 0, 0)`;
    connection.query(insertDishQuery, [dishName], (err, result) => {
        if (err) {
            console.error('Error inserting dish into database:', err);
            return res.status(500).send('Error suggesting menu item');
        }
        console.log("Menu item suggested successfully");
        res.redirect('/mainpage');
    });
});

// Handle Performane Proposals form submission
app.post('/performanceProposals', (req, res) => {
    const { performanceType, performanceDuration, anySpecial } = req.body;

    // Insert propsal data into PerformanceProposals table
    const proposalInsertQuery = `INSERT INTO PerformanceProposals (PerformanceType, Duration, SpecialRequirements, PerformanceStatus, UserID) VALUES (?, ?, ?, ?, ?)`;
    connection.query(proposalInsertQuery, [performanceType, performanceDuration, anySpecial, 'NotApproved', loggedInUsername], (proposalInsertError, proposalInsertResult) => {
        if (proposalInsertError) {
            console.error('Error inserting family data into database:', proposalInsertError);
            return res.status(500).send('Error registering family members');
        }
        const proposalID = proposalInsertResult.insertId;
        console.log("Performance Proposal Added Successfully");
        res.redirect('/mainpage');
    });
});

// Serve userList.html
app.get('/adminpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Route to render user list
app.get('/userlist', (req, res) => {
    const sql = `SELECT UserID FROM Users`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Error fetching user IDs');
            return;
        }
        const users = results.map(result => result.UserID); 
        
        let userListHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>User List</title>
                <!-- Bootstrap CSS -->
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    /* Add any custom CSS here */
                    body {
                        padding: 20px;
                    }
                    #user-list {
                        list-style: none;
                        padding-left: 0;
                    }
                    #user-list li {
                        margin-bottom: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>User IDs:</h1>
                    <form action="/assign-task" method="post">
                        <ul id="user-list">
        `;
        
        users.forEach(user => {
            userListHTML += `
                <li><input type="checkbox" name="users" value="${user}"> ${user}</li>
            `;
        });

        userListHTML += `
                        </ul>
                        <div class="form-group">
                            <label for="task-description">Task Description:</label>
                            <input type="text" class="form-control" id="task-description" name="taskDescription">
                        </div>
                        <div class="form-group">
                            <label for="task-status">Task Status:</label>
                            <select class="form-control" id="task-status" name="taskStatus">
                                <option value="completed">Completed</option>
                                <option value="in-progrescs">In Progress</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Assign Task</button>
                    </form>
                </div>
            </body>
            </html>
        `;

        res.send(userListHTML); // Send the HTML response
    });
});

// Handle task assignment form submission
app.post('/assign-task', (req, res) => {
    const { taskDescription, taskStatus, users } = req.body;
    let usersArray = Array.isArray(users) ? users : [users]; 
    const taskInsertQuery = `INSERT INTO Tasks (TaskDescription, TaskStatus) VALUES (?, ?)`;
    connection.query(taskInsertQuery, [taskDescription, taskStatus], (taskInsertError, taskInsertResult) => {
        if (taskInsertError) {
            console.error('Error inserting task into database:', taskInsertError);
            return res.status(500).send('Error assigning task');
        }
        const taskId = taskInsertResult.insertId;
        const values = usersArray.map(user => [taskId, user]);
        const taskProgressInsertQuery = `INSERT INTO task_progress (TaskID, UserID) VALUES ?`;
        connection.query(taskProgressInsertQuery, [values], (taskProgressInsertError, taskProgressInsertResult) => {
            if (taskProgressInsertError) {
                console.error('Error recording task progress:', taskProgressInsertError);
                return res.status(500).send('Error assigning task');
            }
            res.redirect('/adminpage');
        });
    });
});

app.get('/my-tasks', (req, res) => {
    const sql = `SELECT TaskID FROM task_progress WHERE UserID = ?`;
    connection.query(sql, [loggedInUsername], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Error fetching tasks');
        }

        if (results.length === 0) {
            return res.send('No tasks assigned to you.');
        }

        const taskIDs = results.map(result => result.TaskID);
        const fetchTasksQuery = `SELECT * FROM Tasks WHERE TaskID IN (?)`;
        connection.query(fetchTasksQuery, [taskIDs], (err, taskResults) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Error fetching tasks');
            }

            // Display tasks
            let taskListHTML = '<h2>Your Tasks:</h2>';
            taskResults.forEach(task => {
                taskListHTML += `<p>Task ID: ${task.TaskID}, Description: ${task.TaskDescription}, Status: ${task.TaskStatus}</p>`;
            });

            res.send(taskListHTML);
        });
    });
});