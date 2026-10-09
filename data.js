// data.js - master data for the leave tracker. Edit this file to add people, leave types or leave rows.

// Team members (shown in dropdowns and the availability view)
const RES = ["Deekshith THANUKU", "Sara EBRAHIM ALI MOHAMED AHMED", "Muhammad Farhan IQBAL", "Bishnu Kumar BHAGAT"];

// Leave types (shown in dropdowns and the summary table)
const TYPES = ["Vacation", "Sick Leave", "Casual", "Birthday"];

// Short aliases used in the rows below
const D = "Deekshith THANUKU", S = "Sara EBRAHIM ALI MOHAMED AHMED", B = "Bishnu Kumar BHAGAT", F = "Muhammad Farhan IQBAL";
const A = "Approved", P = "Pending";

// Leave rows: [resource, leave type, start (YYYY-MM-DD), end (YYYY-MM-DD), status]
const LEAVE_DATA = [
[D,"Sick Leave","2026-01-19","2026-01-19",A],[D,"Vacation","2026-02-19","2026-02-20",A],[D,"Vacation","2026-03-19","2026-03-19",A],
[D,"Sick Leave","2026-03-30","2026-03-30",A],[D,"Vacation","2026-03-31","2026-03-31",A],[D,"Vacation","2026-04-20","2026-04-21",A],
[D,"Vacation","2026-06-05","2026-06-09",A],[D,"Vacation","2026-06-29","2026-06-29",A],[D,"Casual","2026-07-07","2026-07-07",A],
[D,"Birthday","2026-07-20","2026-07-20",A],[D,"Casual","2026-09-15","2026-09-15",A],[D,"Sick Leave","2026-09-16","2026-09-16",A],
[D,"Vacation","2026-10-12","2026-10-19",A],[D,"Vacation","2026-11-06","2026-11-06",P],[D,"Vacation","2026-12-01","2026-12-11",P],
[S,"Vacation","2026-08-24","2026-08-24",A],[S,"Vacation","2026-11-23","2026-12-01",P],[S,"Vacation","2026-12-28","2026-12-31",P],
[B,"Sick Leave","2026-02-02","2026-02-03",A],[B,"Vacation","2026-03-11","2026-03-13",A],[B,"Sick Leave","2026-06-12","2026-06-15",A],
[B,"Vacation","2026-08-04","2026-08-07",A],[B,"Sick Leave","2026-09-23","2026-09-24",A],
[B,"Birthday","2026-11-09","2026-11-09",P],[B,"Vacation","2026-11-10","2026-11-13",P],[B,"Vacation","2026-11-30","2026-11-30",P],[B,"Vacation","2026-12-02","2026-12-02",P],
[B,"Vacation","2026-12-21","2026-12-24",P],[B,"Vacation","2026-12-28","2026-12-31",P],[F,"Vacation","2026-05-13","2026-06-23",A]
];

