$(document).ready(function() {
  // fake events,
  /*
    start: date value YYYY-MM-DD
    bookable: boolean if day is bookable
    className: for later stylings/js
    color: daycolor (red, orange, green), can have different name
    price: price for tooltip, minprice for this day
  */
  const crsOfferId = $('#calendar').data('crs-offer-id'); // offerid
  const cal0 = $('#calendar1'); // first calendar
  const cal1 = $('#calendar2'); // second calendar
  let selectedArrival = '';
  let selectedDeparture = '';
  let lang = $('html').attr('lang') ? $('html').attr('lang') : 'en'
  let calendarType = 'arrival';
  let loadedEvents = [];

  // set date in div attributes
  function setDate(date1, date2) {
    jQuery('#calendar1').attr('date', moment(date1).format('YYYY-MM-DD'));
    jQuery('#calendar2').attr('date', moment(date2).format('YYYY-MM-DD'));
  }

  // gets calendar date to reload next months
  function getDate() {
    const $date1 = jQuery('#calendar1').fullCalendar('getDate'); // need to add one, because month() starts from 0
    const $date2 = jQuery('#calendar2').fullCalendar('getDate');
    setDate($date1._d, $date2._d);
  }

  // set arrival event for departure selection, remove availability for current arrival
  function setArrivalEvent(calEvent) {
    // need to loop over fullCalendar events to get events from both calendars
    let event0 = {};
    let event1 = {};
    cal0.fullCalendar('clientEvents').forEach(function (item, index) {
      if (calEvent.start._i === item.start._i) {
        event0 = item;
        event0.className[0] = 'fc-arrival';
      }
    });
    cal1.fullCalendar( 'clientEvents').forEach(function (item, index) {
      if (calEvent.start._i === item.start._i) {
        event1 = item;
        event1.className[0] = 'fc-arrival';
      }
    });
    selectedArrival = calEvent.start._i;

    cal0.fullCalendar( 'updateEvent', event0 );
    cal1.fullCalendar( 'updateEvent', event1 );
  }

  // set departure event for length of stay, remove availability event for current departure date
  function setDepartureEvent(calEvent) {
    selectedDeparture = calEvent.start._i;
    calEvent.className[0] = 'fc-departure';
    calEvent.title = '';
    cal0.fullCalendar( 'updateEvent', calEvent );
    cal1.fullCalendar( 'updateEvent', calEvent );
  }

  function setLengthOfStay(arrival, departure) {
    const allEvents0 = cal0.fullCalendar( 'clientEvents');
    const allEvents1 = cal1.fullCalendar( 'clientEvents');
    // get date range to delete dates
    for (const m = moment(arrival); m.diff(departure, 'days') <= 0; m.add(1, 'days')) {
      for (let i = 0; i < allEvents0.length; i++) {
        if (allEvents0[i].start._i === m.format('YYYY-MM-DD')) {
          cal0.fullCalendar('removeEvents', allEvents0[i]._id);
        }
      }
    }
    for (const m = moment(arrival); m.diff(departure, 'days') <= 0; m.add(1, 'days')) {
      for (let i = 0; i < allEvents1.length; i++) {
        if (allEvents1[i].start._i === m.format('YYYY-MM-DD')) {
          cal1.fullCalendar('removeEvents', allEvents1[i]._id);
        }
      }
    }
    departure = moment(departure).add(1, 'day').format('YYYY-MM-DD');;
    event = [{
      start: arrival,
      end: departure,
      bookable: true,
      className: 'fc-lengthofstay',
      price: 0,
      title: ''
    }];

    cal0.fullCalendar('addEventSource', event);
    cal1.fullCalendar('addEventSource', event);

    // set calendartype to selected
    calendarType = 'selected';
  }

  function initTooltip(event) {
    let tooltip = event.notAvailable;
    if (event.bookable === true) {
      if (event.IsClosedOnArrival === true && calendarType === 'arrival') {
        tooltip = event.noArrival;
      } else if (event.IsClosedOnDeparture && calendarType === 'departure') {
        tooltip = event.noDeparture;
      } else {
        tooltip = event.available;
      }
    }

    return tooltip;
  }
  // switch calendar to departure view, switch calendartype to departure
  function switchCalendar(calendar) {
    calendarType = calendar;
    const newEvents0 = manipulateEvents(cal0.fullCalendar('clientEvents'), calendar);
    const newEvents1 = manipulateEvents(cal1.fullCalendar('clientEvents'), calendar);
    // add departure events
    cal0.fullCalendar( 'updateEvents', newEvents0 );
    cal1.fullCalendar( 'updateEvents', newEvents1 );
  }

  /*
    manipulate events for arrival and departure selection
    arrival calendar: closedOnArrival to not selectable(red), closed on  departure to selectable(green)
    departure calendar: closedOnArrival to selectable(green), closed on departure to not selectable(red)
  */
  function manipulateEvents(events, calendar) {
    calendarType = calendar;
    // loop over every event and check if it is bookable for the current calendartype
    for (var i = 0; i < events.length; i++) {
      if (events[i].bookable === true) {
        // rewrite events for departure eventcalendar
        if (calendarType === 'departure') {
          if (events[i].IsClosedOnDeparture === true ) {
            events[i].selectable = false;
            events[i].className[0] = "fc-notBookable";
          }
          else {
            events[i].selectable = true;
            events[i].className[0] = "fc-bookable";
          }
        }
        // rewrite events for arrival eventcalendar
        else {
          if (events[i].IsClosedOnArrival === true) {
            events[i].selectable = false;
            events[i].className[0] = "fc-notBookable";
          }
          else {
            events[i].selectable = true;
            events[i].className[0] = "fc-bookable";
          }
        }
      }
    }
    return events;
  }

  // reinit calendar if user selects a different arrival date
  function resetCalendar() {
    cal0.fullCalendar( 'removeEvents');
    cal1.fullCalendar( 'removeEvents');

    cal0.fullCalendar('addEventSource', loadedEvents);
    cal1.fullCalendar('addEventSource', loadedEvents);
  }

  function handleClickEvent(calEvent, jsEvent, view) {
    var calendarSelectType = $('.availability').attr('data-calendar-type');
    if (calEvent.selectable === true && calEvent.bookable === true) {
      if (calendarType === 'arrival' && calEvent.selectable === true || calEvent.selectable === true && calendarSelectType === 'simple') {
        const $arrivalDate = jQuery('#arrivaldate')
        $arrivalDate.val(calEvent.start._i);
        $arrivalDate.html(calEvent.start._i); // TODO dateformat?!
        if (calendarSelectType !== 'simple') {
          const calendar = 'departure';
          switchCalendar(calendar);
        }
        resetCalendar();
        setArrivalEvent(calEvent);
      }
      else if (calendarType === 'departure' && calEvent.selectable === true && calendarSelectType !== 'simple') {
        // check if departure is before arrival
        if (moment(selectedArrival).isBefore(calEvent.start._i)) {
          setDepartureEvent(calEvent);
          setLengthOfStay(selectedArrival, selectedDeparture);
          //Find all the previous events that match the criteria and remove them
          for (const m = moment(selectedArrival); m.isBefore(selectedDeparture); m.add(1, 'days')) {
            for (let i = 0; i < loadedEvents.length; i++) {
              if (loadedEvents[i].start === m.format('YYYY-MM-DD')) {
                cal0.fullCalendar('removeEvents', loadedEvents[i]);
                cal1.fullCalendar('removeEvents', loadedEvents[i]);
              }
            }
          }
        }
      }
      else {
        calendarType = 'arrival';
        resetCalendar();
      }
    }
    else if(calEvent.selectable == null) {
      calendarType = 'arrival';
      resetCalendar();
    }
  }
  // load availability for next months
  function loadAvailabilityPerMonth(dateFrom, dateTo) {
    $.ajax({
      method: 'GET',
      url: '/seamlessapi/v1/avcalendardaterange/' + crsOfferId+ '/' +dateFrom+ '/' +dateTo+ '/'+lang+'/true',
      dataType: 'json',
      beforeSend: function () {
        jQuery('.loader').css('display', 'block');
      },
      success: function( response ) {
        jQuery('.loader').css('display', 'none');
        cal0.fullCalendar('addEventSource', response);
        cal1.fullCalendar('addEventSource', response);
        response.forEach(function (item, index) {
          loadedEvents.push(item);
        });
      },
      error: function(response) {
        console.log('Something went wrong');
      }
    });
  }

  // first initialization
  function initCalendar(events) {
    loadedEvents = events;
    manipulateEvents(events, calendarType);
    // set lang because there is a bug when loading events via ajax
    if (events[0].locale) {
      lang = events[0].locale;
    }
    // init first calendar with prev/next button
    cal0.fullCalendar({
      header: {
        left: 'title', // month
        right: '' // change month with prev,next
      },
      defaultDate: moment().startOf('month').format('YYYY-MM-DD'), // where to start with the calendar, later change to variable with first day of the month
      contentHeight:"auto", // don't show scrollbar
      events: events, // event array
      showNonCurrentDates: false, // don't show old events/availabilities
      eventTextColor: '#ffffff',
      locale: lang,
      // selectDate
      eventClick: function(calEvent, jsEvent, view) {
        // created function because of redundant code for different calendars
        handleClickEvent(calEvent, jsEvent, view);
      },
      // show rate details, price etc.
      eventMouseover:function( event, jsEvent, view ) {
        initTooltip(event);
      },
      eventRender: function(event, element, view) {
        var eventEnd = moment(event.start);
        var NOW = moment();
        var today = moment().format('YYYY-MM-DD')
        if (eventEnd.diff(NOW, 'seconds') <= 0 && eventEnd._i != today) {
          return false;
        }
      },
    });
    cal1.fullCalendar({
      header: {
        left: 'title', // month
        right: 'prev,next' // change month
      },
      defaultDate: moment().add(1, 'months').startOf('month').format('YYYY-MM-DD'), // where to start with the second calendar, later change to variable with first day of the second month
      contentHeight:"auto", // don't show scrollbar
      events: events, // event array, currently filled with fake data
      showNonCurrentDates: false,
      eventTextColor: '#ffffff',
      locale: lang,
      // selectDate
      eventClick: function(calEvent, jsEvent, view) {
        handleClickEvent(calEvent, jsEvent, view);
      },       // show rate details, price etc.
      eventMouseover:function( event, jsEvent, view ) {
        const tooltip = initTooltip(event);
      },
      // to change both calendar's on next/prev click, only needed in calendar with the buttons
      viewRender: function (view, element) {
        cur = view.intervalStart;
        d = moment(cur).add(-1, 'months');
        cal0.fullCalendar('gotoDate', d);
      }
    });
    getDate();
  };
  // first availability
  $.ajax({
    method: 'GET',
    url: '/seamlessapi/v1/avcalendardaterange/' + crsOfferId,
    dataType: 'json'
  }).done(function(data) {
    initCalendar(data);
  });

  // load availability when month has changed
  $('body').delegate('#calendar2 .fc-next-button', 'click', function() {
    var date = $('#calendar2').attr('date'); // get second calendar date
    var newMonth = moment(jQuery("#calendar2").fullCalendar('getDate')).format('YYYY-MM-DD');
    // check if we need to load availability
    var loadAvailability = moment(newMonth).isAfter(date);
    if (loadAvailability) {
      var dateFrom = moment(date).add(1, 'months').format('YYYY-MM-DD'); // get next month
      var dateTo = moment(dateFrom).endOf('month').format('YYYY-MM-DD'); // get end of the month
      loadAvailabilityPerMonth(dateFrom, dateTo);
      setDate(date, dateFrom);
    }
  });

  // TODO: should be css
  $('body').delegate('.fc-event-container .fc-notBookable', 'mouseover', function() {
    jQuery(this).css('cursor', 'default');
  });
  // switch to departure
});
