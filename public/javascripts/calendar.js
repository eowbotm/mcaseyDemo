$(function(){
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay',
            ignoreTimezone: false
        },
        selectable: true,
        selectHelper: true,
        editable: true,
        events: 'https://www.google.com/calendar/feeds/mikestcasey%40gmail.com/public/basic'
    });
});