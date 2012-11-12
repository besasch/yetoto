function ApplicationViewModel(){
	
    var self                     = this;

    self.todaysDate              = moment(); // Contains today's date
    self.shownDay                = ko.observable(); // Contains the date of the day shown on the frontend
    self.shownDayFormatted       = ko.computed(function() { // Contains the formatted date
            return moment(self.shownDay()).format("DD.MM.YYYY");
        });

    self.events                  = ko.observable({});
    self.user                    = ko.observable({});
    self.calendars               = ko.observableArray();

    self.eventContainer          = ko.observable();
    self.calendarContainer       = ko.observable();

    self.searchTerm              = ko.observable();
    self.searchResults           = ko.observableArray();



/*        88   ad88888ba   88888888888  88888888ba       888b      88         db   8b           d8
88        88  d8"     "8b  88           88      "8b      8888b     88        d88b  `8b         d8'
88        88  Y8,          88           88      ,8P      88 `8b    88       d8'`8b  `8b       d8'
88        88  `Y8aaaaa,    88aaaaa      88aaaaaa8P'      88  `8b   88      d8'  `8b  `8b     d8'
88        88    `"""""8b,  88"""""      88""""88'        88   `8b  88     d8YaaaaY8b  `8b   d8'
88        88          `8b  88           88    `8b        88    `8b 88    d8""""""""8b  `8b d8'
Y8a.    .a8P  Y8a     a8P  88           88     `8b       88     `8888   d8'        `8b  `888'
 `"Y8888Y"'    "Y88888P"   88888888888  88      `8b      88      `888  d8'          `8b  `*/


    self.goToNewCalendar = function() {
        
        self.calendarContainer(new Calendar({title: '', description: ''}));
        self.redirectClickEvent('fileSelect', 'fileElem');
        self.openModal('NewCalendarModal');
    };

    self.goToUpdateCalendar = function(chosenCalendar) {

        self.closeModals();
        self.calendarContainer(chosenCalendar);
        self.redirectClickEvent('fileSelectUpdate', 'fileElemUpdate');
        self.openModal('UpdateCalendarModal');
    };

    self.goToUpdateEvent = function(chosenEvent) {

        self.closeModals();

        chosenEvent.inputStartDate   = moment(chosenEvent.startDate).format('DD.MM.YYYY');
        chosenEvent.inputStartTime   = moment(chosenEvent.startDate).format('HH:mm');
        chosenEvent.inputEndDate     = moment(chosenEvent.endDate).format('DD.MM.YYYY');
        chosenEvent.inputEndTime     = moment(chosenEvent.endDate).format('HH:mm');

        self.eventContainer(chosenEvent);

        self.enableDateAndTimePicker();

        self.openModal('UpdateEventModal');
    };

    self.goToNewEvent = function(calendars) {

        self.eventContainer(new Event({
                title: "", content: "", startDate: moment(), endDate: moment(),
                location: "", _calendar: calendars._id, inputStartDate: ""})
            );
        self.enableDateAndTimePicker();
        self.openModal('NewEventModal');
    };

    self.goToTomorrow  = function() {
        self.shownDay(moment(self.shownDay()).add('days', 1));
    };
    
    self.goToYesterday = function() {
        self.shownDay(moment(self.shownDay()).subtract('days', 1));
    };

    self.goToEvent     = function(chosenEvent) {
        self.eventContainer(chosenEvent);
        self.openModal('ShowEventModal');
    };

    self.goToCalendar     = function(chosenCalendar) {
        self.calendarContainer(chosenCalendar);
        self.openModal('ShowCalendarModal');
    };



/*        88    88       ad88888ba  888888888888  88        88  88888888888  88888888888
88        88    88      d8"     "8b      88       88        88  88           88
88        88    88      Y8,              88       88        88  88           88
88        88    88      `Y8aaaaa,        88       88        88  88aaaaa      88aaaaa
88        88    88        `"""""8b,      88       88        88  88"""""      88"""""
88        88    88              `8b      88       88        88  88           88
Y8a.    .a8P    88      Y8a     a8P      88       Y8a.    .a8P  88           88
 `"Y8888Y"'     88       "Y88888P"       88        `"Y8888Y"'   88           */


    self.openModal = function(domId) {
        $('#' + domId).modal('show');
    };

    self.closeModals = function() {
        $('.modal').modal('hide');
    };

    self.enableDropdowns = function(){
        $('.dropdown-toggle').dropdown();
    };

    self.openSearchBox = function(){
        $('#search-form').addClass('open');
    };

    self.closeSearchBox = function(){
        $('#search-form').removeClass('open');
    };

    self.redirectClickEvent = function(fromId, toId){
        //Image Handling
        var fileSelectUpdate = document.getElementById(fromId);
        var fileElemUpdate = document.getElementById(toId);
         

        fileSelectUpdate.addEventListener("click", function (e) {
          if (fileElemUpdate) {
            fileElemUpdate.click();
          }
          e.preventDefault(); // prevent navigation to "#"
        }, false);
    };

    self.enableDateAndTimePicker = function(){
        $('.init-timepicker').timepicker({ 'timeFormat': 'H:i' });
        $('.init-datepicker').datepicker({ 'dateFormat': 'dd.mm.yy' });
    };


/*888888ba,         db    888888888888    db              ad88888ba  888888888888  ,ad8888ba,    88888888ba   88888888888
88      `"8b       d88b        88        d88b            d8"     "8b      88      d8"'    `"8b   88      "8b  88
88        `8b     d8'`8b       88       d8'`8b           Y8,              88     d8'        `8b  88      ,8P  88
88         88    d8'  `8b      88      d8'  `8b          `Y8aaaaa,        88     88          88  88aaaaaa8P'  88aaaaa
88         88   d8YaaaaY8b     88     d8YaaaaY8b           `"""""8b,      88     88          88  88""""88'    88"""""
88         8P  d8""""""""8b    88    d8""""""""8b                `8b      88     Y8,        ,8P  88    `8b    88
88      .a8P  d8'        `8b   88   d8'        `8b       Y8a     a8P      88      Y8a.    .a8P   88     `8b   88
88888888Y"'  d8'          `8b  88  d8'          `8b       "Y88888P"       88       `"Y8888Y"'    88      `8b  888888888*/


    self.hideCalendar = function(calendars){
        calendars.isHidden(true);
        for(var i = 0; i < self.events().length; i++) {
                if(calendars._id == self.events()[i]._calendar._id)
                    self.events()[i].isHidden(true);
        }
    };

    self.unhideCalendar = function(calendars){
        calendars.isHidden(false);
        for(var i = 0; i < self.events().length; i++) {
                if(calendars._id == self.events()[i]._calendar._id)
                    self.events()[i].isHidden(false);
        }
    };

    self.calendarsInit  = function(data){

        var mappedCalendars = [];

        for(var i = 0; i < data.userCalendars.length; i++) {
            mappedCalendars.push(new Calendar(data.userCalendars[i], true));
        }

        for(var j = 0; j < data.subscriptions.length; j++) {
            mappedCalendars.push(new Calendar(data.subscriptions[j], false));
        }
        self.calendars(mappedCalendars);
    };


    self.addEventToFrontend = function(eventObj){

        var key = moment(eventObj.startDate).format("DD.MM.YYYY");
        var value = new Event(eventObj, false);

        if(self.events()[key]){
            self.events()[key].push(value);

        } else {
            var newArray = ko.observableArray();
            newArray.push(value);

            self.events()[key] = newArray;
        }

    };

    self.updateEventToFrontend = function(eventObj){

        var key        = moment(eventObj.startDate).format("DD.MM.YYYY");
        var valueArray = self.events()[key];
        var value      = new Event(eventObj, false);

        for (var i = 0; i < valueArray.length; i++) {

            if(valueArray[i]._id == eventObj._id){
                
                valueArray.slice(i, 1, value);
                self.events()[key] = valueArray;
                break;
            }
        }
    };

    self.removeEventFromFrontend = function(eventObj){

        var key         = moment(eventObj.startDate).format('DD.MM.YYYY');
        var eventsArray = self.events()[key];

        // DAFUQ Warum geht das plötzlich nicht mehr???

        for(var i = 0; i < eventsArray.length; i++ ){
            
            if(eventsArray[i]._id == eventObj._id){
            
                eventsArray.splice(i, 1);
                self.events()[key] = eventsArray;
                break;
            }
        }
        self.closeModals();
        self.shownDay(eventObj.startDate);
    };

    self.removeCalendarFromFrontend = function(data, calendar){
        //Remove calendar also in Front End
        self.calendars.remove(calendar);
        
        //Remove Events from deleted calendar from Front End
        var i = data.events.length;
        while(i--){
            self.removeEventFromFrontend(data.events[i]);
        }
    };

    self.updateCalendarOnFrontend = function(updatedCalendarData){
        for (var i = 0; i < self.calendars().length; i++) {
            if(self.calendars()[i]._id == updatedCalendarData._id){
                
                self.calendars.splice(i, 1, new Calendar(updatedCalendarData, true));
                break;
            }
        }
    };

    self.addUserCalendarToFrontend = function(newCalendarData){

        self.calendars.push(new Calendar(newCalendarData, true));
    };

    self.addSubscriptionToFrontend = function(newCalendarData){

        self.calendars.push(new Calendar(newCalendarData, false));
    };

    self.removeSubscriptionFromFrontend = function(chosenCalendar){
        self.calendars.remove(chosenCalendar);
    };


    self.searchTerm.subscribe(function () {

        self.enableDropdowns();

        if(self.searchTerm().length > 2){

            self.openSearchBox();

            // Call the server for serach results and pass it a callback to process the results data
            self.loadSearchResults(function(results) {

                if (results.calendarResults.length > 0){

                    var mappedCalendars = [];

                    for(var i = 0; i < results.calendarResults.length; i++) {
                        mappedCalendars.push(new Calendar(results.calendarResults[i]));
                    }
                    self.searchResults(mappedCalendars);

                } else {

                    self.searchResults([]);
                }
            });

        } else {
            self.searchResults([]);
            self.closeSearchBox();
        }
    });


       /*                88        db         8b        d8
      d88b               88       d88b         Y8,    ,8P
     d8'`8b              88      d8'`8b         `8b  d8'
    d8'  `8b             88     d8'  `8b          Y88P
   d8YaaaaY8b            88    d8YaaaaY8b         d88b
  d8""""""""8b           88   d8""""""""8b      ,8P  Y8,
 d8'        `8b  88,   ,d88  d8'        `8b    d8'    `8b
d8'          `8b  "Y8888P"  d8'          `8b  8P        */


    self.deleteCalendar = function(calendar) {
    
        $.ajax({
            url: '/data/delete/' + calendar._id,
            type: 'post',
            dataType: 'json',
            success: function(data) {
                self.removeCalendarFromFrontend(data, calendar);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    };
    
    self.updateEvent = function(){
        self.closeModals();

        $.ajax({
            type: 'POST',
            url: '/data/updateevent',
            data: { "data": JSON.stringify(self.eventContainer()) },
            dataType: "json",
            success: function(data) {
                self.updateEventToFrontend(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    };

    self.updateCalendar = function () {
        self.closeModals();
        
        //Get type and data of uploaded image
        var chosenImage = document.getElementById('updateCalendarPhoto').src;
        var type = chosenImage.substring(chosenImage.indexOf('/') + 1, chosenImage.indexOf(';'));
        var image = chosenImage.substring(chosenImage.indexOf(',') + 1);

        $.ajax({
            type: 'POST',
            url: '/data/updatecalendar',
            data: {
                "data": JSON.stringify(self.calendarContainer()),
                "image": image,
                "type": type
            },
            dataType: 'json',
            success: function(data) {
                self.updateCalendarOnFrontend(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    };

    self.addCalendar = function() {
        
        //Get type and data of uploaded image
        var chosenImage = document.getElementById('newCalendarPhoto').src;
        var type = chosenImage.substring(chosenImage.indexOf('/') + 1, chosenImage.indexOf(';'));
        var image = chosenImage.substring(chosenImage.indexOf(',') + 1);

        $.ajax({
            type: 'POST',
            url: '/data/newcalendar',
            data: {
                "data": JSON.stringify(self.calendarContainer()),
                "image": image,
                "type": type
            },
            dataType: 'json',
            success: function(data) {
                self.addUserCalendarToFrontend(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
        self.closeModals();
    };

    self.addEvent = function() {
        var newEvent           = self.eventContainer();
        
        // Calculate start and end date accorrding to the users inputs
        newEvent.startDate = moment(newEvent.inputStartDate+" "+newEvent.inputStartTime, "DD.MM.YYYY H:mm");
        newEvent.endDate   = moment(newEvent.inputEndDate+" "+newEvent.inputEndTime, "DD.MM.YYYY H:mm");

        // Send the event to the server
        $.ajax({
            type: 'POST',
            url: '/data/' + newEvent._calendar + '/newevent',
            data: {
                "data": JSON.stringify(newEvent)
            },
            dataType: "json",
            success: function(data) {
                self.addEventToFrontend(new Event(data, false));
                self.shownDay(newEvent.startDate);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
        self.closeModals();
    };

    self.deleteEvent = function(chosenEvent){

        $.ajax({
            type: 'POST',
            url: '/data/events/' + chosenEvent._id + '/delete',
            dataType: 'json',
            success: function(data) {
                self.removeEventFromFrontend(chosenEvent);
            }
        });
    };

    self.subscribeCalendar = function() {
        var cal = self.calendarContainer();

        $.ajax({
            url: '/data/subscribe/' + cal._id,
            dataType: 'json',
            success: function(data) {
                self.addSubscriptionToFrontend(data);
            }
        });
    };

    self.unsubscribeCalendar = function(chosenCalendar) {

        var serverUrl = '/data/unsubscribe/' + chosenCalendar._id;

        $.ajax({
            url: serverUrl,
            dataType: 'json',
            success: function(data) {
                self.removeSubscriptionFromFrontend(chosenCalendar);
            }
        });
    };

    self.loadSearchResults = function(cb){
        $.ajax({
            url: '/data/search/' + self.searchTerm(),
            dataType: 'json',
            success: function(data) {
                cb(data);
            }
        });
    };

    self.loadData = function(){

        $.ajax({
            url: '/data/all',
            dataType: 'json',
            success: function(data) {
                self.user(data.user);
                var eventList = data.events;

                self.calendarsInit(data.user);

                // Put the events into the self.events object
                for (var i = 0; i < eventList.length; i++) {
                    self.addEventToFrontend(eventList[i]);
                }

                self.shownDay(self.todaysDate); // Set shownDate to today's date

            }

        });
    };



    self.loadData();
    
}


/*888888888  888b      88  88888888ba,
88           8888b     88  88      `"8b
88           88 `8b    88  88        `8b
88aaaaa      88  `8b   88  88         88
88"""""      88   `8b  88  88         88
88           88    `8b 88  88         8P
88           88     `8888  88      .a8P
88888888888  88      `888  8888888*/




function Event(data, isHidden) {
    var self              = this;
    
    self._id              = data._id;
    self.title            = data.title;
    self.content          = data.content;
    
    self.startDate        = data.startDate;
    self.endDate          = data.endDate;
    
    self.location         = data.location;
    self._calendar        = data._calendar;
    self.creationTime     = data.creationTime;
    self.modificationTime = data.modificationTime;
    self.owner            = data.owner;
    
    self.startTime        = ko.computed(function() {
    return moment(self.startDate).format('HH:mm');
    }, self);
    
    self.endTime          = ko.computed(function() {
    return moment(self.endDate).format('HH:mm');
    }, self);
    
    
    // Data to calculate start and enddate: PUT THIS INTO ANOTHER FUNCTION??
    self.inputStartDate   = data.inputStartDate;
    self.inputStartTime   = data.inputStartTime;
    self.inputEndDate     = data.inputEndDate;
    self.inputEndTime     = data.inputEndTime;

    self.isHidden         = ko.observable(isHidden);
}

// 1.) Am Anfang: Alle abonniereten und eigenen Kalender laden
	
function Calendar(data, isOwner) {
	var self = this;
	
    self._id         = data._id;
    self.title       = data.title;
    self.picture     = data.picture;
    self.description = data.description;
    self.isOwner     = ko.observable(isOwner);
    self.isHidden    = ko.observable(false);
    
}


function handleImage(files, elementId) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var imageType = /image.*/;
         
         
        var img = document.getElementById(elementId);
        img.file = file;

        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
  }
}





ko.applyBindings(new ApplicationViewModel());




