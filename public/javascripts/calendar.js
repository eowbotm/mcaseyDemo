$(function(){
    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay',
            ignoreTimezone: false
        },
		select: function(start, end, allDay) {
			var title = prompt('Event Title: ');
			if(title)
			{
				var data = {title: title,
					start: start,
					end: end,
					allDay: allDay,
					color : "blue"};
				calendar.fullCalendar('renderEvent',
					data,
					true);
				data = {title: title,
				start:start._d,
				end: end._d,
				color: "blue"};
				$.post("/calendar/addevent",data);
			}
			calendar.fullCalendar('unselect');
		},
        selectable: true,
        selectHelper: true,
        editable: true,
        events: 'calendar/events'
    });
});