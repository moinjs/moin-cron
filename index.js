function getNextTime(pattern) {
    var later = require('later');
    later.date.localTime();
    var cronSched = later.parse.cron(pattern);
    var now = new Date();
    var nexts = later.schedule(cronSched).next(2);
    if (later.schedule(cronSched).isValid(now)) {
        return nexts[1];
    } else {
        return nexts[0];
    }
}
function isLastDay(dt) {
    var test = new Date(dt.getTime()),
        month = test.getMonth();

    test.setDate(test.getDate() + 1);
    return test.getMonth() !== month;
}

var cronJobs = [
    {
        name: "minute",
        pattern: "*/1 * * * *"
    },
    {
        name: "quarter",
        pattern: "*/15 * * * *"
    },
    {
        name: "hour",
        pattern: "0 * * * *"
    }
].map(function (e) {
    e.nextSchedule = getNextTime(e.pattern);
    e.locked = false;
    return e;
}).reduce(function (all, job) {
    all[job.name] = job;
    return all;
}, {});


setInterval(function () {
    var now = new Date();
    Object.keys(cronJobs)
        .filter((id)=>!cronJobs[id].locked && cronJobs[id].nextSchedule < now)
        .map((id)=> {
            cronJobs[id].locked = true;
            return id;
        }).forEach(function (id) {
        var s = cronJobs[id].nextSchedule;
        var day = s.getDay();
        var event = {
            type: cronJobs[id].name,
            hour: s.getHours(),
            minute: s.getMinutes(),
            second: s.getSeconds(),
            weekday: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][day],
            weekdayNum: [7, 1, 2, 3, 4, 5, 6][day],
            isWeekend: (day == 0 || day == 6),
            isWeekDay: (day > 0 && day < 6),
            month: s.getMonth() + 1,
            day: s.getDate(),
            year: s.getFullYear(),
            lastDayOfMonth: isLastDay(s)
        };
        moin.emit("cron", event);
        cronJobs[id].nextSchedule = getNextTime(cronJobs[id].pattern);
        cronJobs[id].locked = false;
    })
}, 1000);