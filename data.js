// data.js - master data for the leave tracker. Edit this file to add people, leave types or leave rows.

// Teams and their members. Add a team or a person here.
const TEAMS = {
  "VeriTouch": ["Deekshith THANUKU", "Sara EBRAHIM ALI MOHAMED AHMED", "Muhammad Farhan IQBAL", "Bishnu Kumar BHAGAT"],
  "VeriChannel": ["Tamer Ildan", "Ozan Kanik", "Musa Karakelle", "Bahadır Uysal", "Özenç Taşdelen", "Peyman Öter", "Hamid Hameed", "Aadil Ali", "Merve Boztürk", "Cenk Türker", "Ayberk Kerman"]
};
// Derived - do not edit
const RES = Object.values(TEAMS).flat();
const TEAM_OF = Object.fromEntries(Object.entries(TEAMS).flatMap(([t, m]) => m.map(n => [n, t])));

// Where each person is based (used to pick the right public holidays).
const LOCATION_OF = {
  "Deekshith THANUKU": "India",
  "Sara EBRAHIM ALI MOHAMED AHMED": "Bahrain",
  "Muhammad Farhan IQBAL": "Pakistan",
  "Hamid Hameed": "Pakistan",
  "Aadil Ali": "Pakistan",
  "Bishnu Kumar BHAGAT": "Germany",
  "Ozan Kanik": "Germany",
  "Musa Karakelle": "Germany",
  "Bahadır Uysal": "Germany",
  "Tamer Ildan": "UK",
  "Özenç Taşdelen": "Turkey",
  "Peyman Öter": "Turkey",
  "Merve Boztürk": "Turkey",
  "Cenk Türker": "Turkey",
  "Ayberk Kerman": "Turkey"
};

// Public holidays per location: [date (YYYY-MM-DD), name]
// Only full-day holidays are listed (half days are not supported, see notes under Turkey).
const HOLIDAYS = {
  "India": [],
  "Bahrain": [],
  "Pakistan": [],
  "UK": [],
  "Germany": [
    ["2026-01-01", "New Year's Day"],
    ["2026-04-03", "Good Friday"],
    ["2026-04-06", "Easter Monday"],
    ["2026-05-01", "Labour Day"],
    ["2026-05-14", "Ascension Day"],
    ["2026-05-25", "Whit Monday"],
    ["2026-10-03", "German Unity Day"],
    ["2026-12-25", "Christmas Day"],
    ["2026-12-26", "Second Day of Christmas (Boxing Day)"]
  ],
  "Turkey": [
    ["2026-01-01", "New Year's Day"],
    // Half day, not listed: 2026-03-19 Ramadan Feast Eve (from 1:00 PM)
    ["2026-03-20", "Ramadan Feast (Day 1)"],
    ["2026-03-21", "Ramadan Feast (Day 2)"],
    ["2026-03-22", "Ramadan Feast (Day 3)"],
    ["2026-04-23", "National Sovereignty and Children's Day"],
    ["2026-05-01", "Labor and Solidarity Day"],
    ["2026-05-19", "Commemoration of Atatürk, Youth and Sports Day"],
    // Half day, not listed: 2026-05-26 Sacrifice Feast Eve
    ["2026-05-27", "Sacrifice Feast (Day 1)"],
    ["2026-05-28", "Sacrifice Feast (Day 2)"],
    ["2026-05-29", "Sacrifice Feast (Day 3)"],
    ["2026-05-30", "Sacrifice Feast (Day 4)"],
    ["2026-07-15", "Democracy and National Unity Day"],
    ["2026-08-30", "Victory Day"],
    // Half day, not listed: 2026-10-28 Republic Day Eve
    ["2026-10-29", "Republic Day"]
  ]
};

// Leave types (shown in dropdowns and the summary table)
const TYPES = ["Vacation", "Sick Leave", "Casual", "Birthday"];

// Short aliases used in the rows below
const D = "Deekshith THANUKU", S = "Sara EBRAHIM ALI MOHAMED AHMED", B = "Bishnu Kumar BHAGAT";
const A = "Approved", P = "Pending";

// Leave rows: [resource, leave type, start (YYYY-MM-DD), end (YYYY-MM-DD), status]
const LEAVE_DATA = [
 ["Bishnu Kumar BHAGAT","Sick Leave","2026-02-02","2026-02-03","Approved"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-03-11","2026-03-13","Approved"],
 ["Bishnu Kumar BHAGAT","Sick Leave","2026-06-12","2026-06-15","Approved"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-08-04","2026-08-07","Approved"],
 ["Bishnu Kumar BHAGAT","Sick Leave","2026-09-23","2026-09-24","Approved"],
 ["Bishnu Kumar BHAGAT","Birthday","2026-11-09","2026-11-09","Pending"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-11-10","2026-11-13","Pending"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-11-30","2026-11-30","Pending"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-12-02","2026-12-02","Pending"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-12-21","2026-12-24","Pending"],
 ["Bishnu Kumar BHAGAT","Vacation","2026-12-28","2026-12-31","Pending"],
 ["Deekshith THANUKU","Sick Leave","2026-01-19","2026-01-19","Approved"],
 ["Deekshith THANUKU","Vacation","2026-02-19","2026-02-20","Approved"],
 ["Deekshith THANUKU","Vacation","2026-03-19","2026-03-19","Approved"],
 ["Deekshith THANUKU","Sick Leave","2026-03-30","2026-03-30","Approved"],
 ["Deekshith THANUKU","Vacation","2026-03-31","2026-03-31","Approved"],
 ["Deekshith THANUKU","Vacation","2026-04-20","2026-04-21","Approved"],
 ["Deekshith THANUKU","Vacation","2026-06-05","2026-06-09","Approved"],
 ["Deekshith THANUKU","Vacation","2026-06-29","2026-06-29","Approved"],
 ["Deekshith THANUKU","Casual","2026-07-07","2026-07-07","Approved"],
 ["Deekshith THANUKU","Birthday","2026-07-20","2026-07-20","Approved"],
 ["Deekshith THANUKU","Casual","2026-09-15","2026-09-15","Approved"],
 ["Deekshith THANUKU","Sick Leave","2026-09-16","2026-09-16","Approved"],
 ["Deekshith THANUKU","Vacation","2026-10-12","2026-10-19","Approved"],
 ["Deekshith THANUKU","Vacation","2026-11-06","2026-11-06","Pending"],
 ["Deekshith THANUKU","Vacation","2026-12-01","2026-12-11","Pending"],
 ["Muhammad Farhan IQBAL","Vacation","2026-05-13","2026-06-23","Approved"],
 ["Sara EBRAHIM ALI MOHAMED AHMED","Vacation","2026-08-24","2026-08-24","Approved"],
 ["Sara EBRAHIM ALI MOHAMED AHMED","Vacation","2026-11-23","2026-12-01","Pending"],
 ["Sara EBRAHIM ALI MOHAMED AHMED","Vacation","2026-12-28","2026-12-31","Pending"],
 ["Musa Karakelle","Vacation","2026-10-19","2026-10-23","Pending"],
 ["Musa Karakelle","Vacation","2026-12-24","2026-12-24","Pending"],
 ["Musa Karakelle","Vacation","2026-12-28","2026-12-31","Pending"],
 ["Özenç Taşdelen","Vacation","2026-10-27","2026-11-06","Pending"],
 ["Merve Boztürk","Vacation","2026-10-30","2026-10-30","Pending"]
];