#Moin Cron

Cron service for the [Moin Application Server](http://npmjs.com/package/moin). 

##Events
Emits time based events.

````javascript
{
    type: "minute", //"quarter", "hour"
    hour: 12,//0-24
    minute: 0,//0-59
    second: 0,//0-59
    weekday: "mon",//"sun", "mon", "tue", "wed", "thu", "fri", "sat"
    weekdayNum: 0,//monday=0,...,sunday=7
    isWeekend: false,
    isWeekDay: true,
    month: 1,//1==January
    day: 1,//day of month
    year: 2016,
    lastDayOfMonth: false,
    event:"cron"
}
````

###Example
````javascript
moin.on({
    type: "hour",
    hour: 23,
    lastDayOfMonth: true,
    event:"cron"
},()=>{
    //on every last day of the month at 23:00
})
````