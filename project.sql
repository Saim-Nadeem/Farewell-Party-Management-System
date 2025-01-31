-- -*- mode: sql -*-

CREATE DATABASE Project_db;
USE Project_DB;

-- Users table
CREATE TABLE Users (
    UserID VARCHAR(150) PRIMARY KEY NOT NULL,
    UserPassword VARCHAR(150) NOT NULL,
    UserRole VARCHAR(50) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL, 
    PhoneNo VARCHAR(20) 
);

-- FamilyMembers table
CREATE TABLE FamilyMembers (
    FamilyMemberID INT PRIMARY KEY auto_increment,
    UserID VARCHAR(150),
    No_of_member INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- FamilyMemberNames table for storing multivalued names
CREATE TABLE FamilyMemberNames (
    FamilyMemberID INT,
    Name VARCHAR(100),
    FOREIGN KEY (FamilyMemberID) REFERENCES FamilyMembers(FamilyMemberID)
);

-- MenuItems table
CREATE TABLE MenuItems (
    MenuItemID INT PRIMARY KEY auto_increment,
    ItemName VARCHAR(100) Not NULL,
    Votes INT Not NULL,
    Price INT Not NULL,
    Quantity INT Not NULL
);

-- menu_suggest table
CREATE TABLE menu_suggest (
    UserID VARCHAR(150),
    MenuItemID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);

CREATE TABLE PerformanceProposals (
    ProposalID INT PRIMARY KEY auto_increment,
    PerformanceType VARCHAR(100) NOT NULL,
    Duration INT NOT NULL,
    SpecialRequirements VARCHAR(255),
    PerformanceStatus VARCHAR(50) NOT NULL,
    UserID VARCHAR(150),
	FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Tasks table
CREATE TABLE Tasks (
    TaskID INT PRIMARY KEY AUTO_INCREMENT,
    TaskDescription VARCHAR(255) NOT NULL,
    TaskStatus VARCHAR(50) NOT NULL
);

-- task_progress table
CREATE TABLE task_progress (
    TaskID INT,
    UserID VARCHAR(150),
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


-- Attendance table
CREATE TABLE Attendance (
    AttendanceID INT PRIMARY KEY auto_increment,
    UserID VARCHAR(150),
    AttendanceDate DATE,
    AttendanceStatus VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Budget table
CREATE TABLE Budget (
    Category VARCHAR(100),
    Amount INT,
    Max_Category_Budget INT
);

INSERT INTO MenuItems (ItemName, Votes, Price, Quantity) VALUES 
    ('Biryani', 0, 250, 0),
    ('Nihari', 0, 300, 0),
    ('Karahi', 0, 200, 0),
    ('Haleem', 0, 180, 0),
    ('Chapli Kebab', 0, 220, 0);


INSERT INTO Users (UserID, UserPassword, UserRole, FullName, Email, PhoneNo)
VALUES ('Saim', 'Admin123', 'admin', 'Saim Nadeem', 'saimnadeem2712@gmail.com', '03235185765');
