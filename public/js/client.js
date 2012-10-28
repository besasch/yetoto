/**
 * Event class to create consistend event objects in the whole application
 */

function ApplicationViewModel(){
	
    var self = this;

    // Data
    self.todaysDate        = moment(); // Contains today's date
    self.shownDay          = ko.observable(); // Contains the date of the day shown on the frontend
    self.shownDayFormatted = ko.computed(function() { // Contains the formatted date
        return moment(self.shownDay()).format("DD.MM.YYYY");
    });

    self.newEventContainer    = ko.observable();
    self.chosenEventContainer = ko.observable();


    self.calendars              = ko.observableArray();
    self.newCalendarContainer   = ko.observable();


    // Behaviour
    /*
     * Shows a modal to the user for adding a new event
     */
    self.CalendarsInit  = function(){

        serverUrl = "/data/userCalendars";
    
        $.ajax({
                url: serverUrl,
                dataType: 'json',
                success: function(data) {
                   var mappedCalendars = [];

                    for(var i = 0; i < data.userCalendars.length; i++) {
                        mappedCalendars.push(new Calendar(data.userCalendars[i], true));
                    }

                    for(var j = 0; j < data.subscriptions.length; j++) {
                        mappedCalendars.push(new Calendar(data.subscriptions[j], false));
                    }
                    self.calendars(mappedCalendars);

                }
            });
    };
    self.deleteCalendar = function(calendar) {
        
        serverUrl = "/data/delete/" + calendar._id;
    
        $.ajax({
                url: serverUrl,
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    //Remove calendar also in Front End
                    self.calendars.remove(calendar);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
            });



    };
    
    self.goToNewCalendar = function() {
        
        // Create some dummy data
        dummy = {title: "", description: ""};
        
        // Write the dummy data into the container
        self.newCalendarContainer(new Calendar(dummy));
       
        // Show the modal for the user to modify the data
        $('#NewCalendarModal').modal('show');


        //Image Handling
        var fileSelect = document.getElementById("fileSelect"),
          fileElem = document.getElementById("fileElem");
         

        fileSelect.addEventListener("click", function (e) {
          if (fileElem) {
            fileElem.click();
          }
          e.preventDefault(); // prevent navigation to "#"
        }, false);
    };
    self.addCalendar = function() {
        // Get the new Calendar out of the container variable
        newCalendar          = new Calendar(self.newCalendarContainer(), true);
        

        // Empty the container variable
        self.newCalendarContainer(null);


        // Send the event to the server
        $.ajax({
            type: 'POST',
            url: '/data/newcalendar',
            data: {
                "data": JSON.stringify(newCalendar)
            },
            dataType: "json",
            success: function() {
                // Push the Calendar into the view array when done
                self.calendars.push(newCalendar);
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });

        // Close Modal
        $('#NewCalendarModal').modal('hide');
    };
    self.goToNewEvent = function(calendars) {
    
        // Create some dummy data
        dummy = {title: "", content: "", startDate: moment(), endDate: moment(),
        location: "", _calendar: calendars._id, inputStartDate: ""};
        
        // Write the dummy data into the container
        self.newEventContainer(new Event(dummy));
        
        // Initiate timepickers and datepickers
        $('.init-timepicker').timepicker({ 'timeFormat': 'H:i' });
        $('.init-datepicker').datepicker({ 'dateFormat': 'dd.mm.yy' }); //jquery-ui datepicker
        //$('.init-datepicker').datepicker({ 'format': 'dd.mm.yy' }); //bootstrap datepicker
        
        // Show the modal for the user to modify the data
        $('#NewEventModal').modal('show');
    };

    /*
     * Adds a new Event to the array and to the server
     * This function gets its data from the container variable newEventContainer
     */

    self.addEvent = function() {
        // Get the new event out of the container variable
        newEvent           = new Event(self.newEventContainer());
        
        // Empty the container variable
        self.newEventContainer(null);
        
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
            success: function() {
                
                self.addEventToFrontend(newEvent); // TODO get the new Event from the Server to give it the right _id (necessary for removing)
                self.shownDay(newEvent.startDate);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });

        // Close Modal
        $('#NewEventModal').modal('hide');
    };

    self.deleteEvent = function(chosenEvent){

        var serverUrl = '/data/events/' + chosenEvent._id + '/delete';

        $.ajax({
            type: 'POST',
            url: serverUrl,
            dataType: 'json',
            success: function(data) {

                self.removeEventFromFrontend(chosenEvent);

                $('#ShowEventModal').modal('hide');

                self.shownDay(chosenEvent.startDate);

            }
        });
    };


    self.goToTomorrow  = function() {
        self.shownDay(moment(self.shownDay()).add('days', 1)); // Set shownDate to the next day
    };
    
    self.goToYesterday = function() {
        self.shownDay(moment(self.shownDay()).subtract('days', 1)); // Set shownDate to the next day
    };
    
    
    /*
    * Shows a modal to the user containing all data for a specific event
    */
    self.goToEvent     = function(chosenEvent) {
        self.chosenEventContainer(chosenEvent);
        $('#ShowEventModal').modal('show');
    };
    
    /*
    * Initialize the app with relevant data
    */
    self.EventsInit          = function() {
        self.shownDay(self.todaysDate); // Set shownDate to today's date
    };

    
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

    // SEARCH

    self.searchTerm = ko.observable();
    self.searchResults = ko.observableArray();

    self.searchTerm.subscribe(function () {

        $('.dropdown-toggle').dropdown();

        if(self.searchTerm().length > 2){
            
            serverUrl = "/data/search/" + self.searchTerm();

            $('#search-form').addClass('open');

            $.ajax({
            url: serverUrl,
            dataType: 'json',
            success: function(data) {

                    if (data.calendarResults.length > 0){

                        var mappedCalendars = [];

                        for(var i = 0; i < data.calendarResults.length; i++) {
                            mappedCalendars.push(new Calendar(data.calendarResults[i]));
                        }
                        self.searchResults(mappedCalendars);
    
                    } else {

                        self.searchResults([]);

                    }
                }
            });
        } else {
            self.searchResults([]);
            $('#search-form').removeClass('open');
        }

    });

    // Calendar
    self.chosenCalendarContainer = ko.observable();

    self.goToCalendar     = function(chosenCalendar) {
        self.chosenCalendarContainer(chosenCalendar);
        $('#ShowCalendarModal').modal('show');
    };

    self.subscribeCalendar = function() {
        var cal = self.chosenCalendarContainer();

        var serverUrl = '/data/subscribe/' + cal._id;

        $.ajax({
            url: serverUrl,
            dataType: 'json',
            success: function(data) {
                self.EventsInit();
                self.calendars.push(cal);
            }
        });
    };

    self.unsubscribeCalendar = function(chosenCalendar) {

        var serverUrl = '/data/unsubscribe/' + chosenCalendar._id;

        $.ajax({
            url: serverUrl,
            dataType: 'json',
            success: function(data) {
                self.EventsInit();
                self.calendars.remove(chosenCalendar);
            }
        });

    };

    // test new dto
    
    self.events = ko.observable({});
    self.user   = ko.observable({});

    self.loadAllData = function(){

        $.ajax({
            url: '/data/all',
            dataType: 'json',
            success: function(data) {
                self.user(data.user);
                var eventList = data.events;

                // Sorting the events should make them being processed faster
                //eventList.sort(self.orderEvents);

                // Put the events into the self.day object
                for (var i = 0; i < eventList.length; i++) {

                    self.addEventToFrontend(eventList[i]);

                }
<<<<<<< HEAD

                console.log(self.user());

=======
>>>>>>> Delete Calendar Function Implemented
            }

        });

    };

    self.addEventToFrontend = function(eventObj){

        var key = moment(eventObj.startDate).format("DD.MM.YYYY");
        var value = new Event(eventObj, false);

        if(self.events()[key]){
            self.events()[key].push(value);

        } else {
            var newArray = new Array(value);

            self.events()[key] = newArray;
        }

    };

    self.removeEventFromFrontend = function(eventObj){

        var key = moment(eventObj.startDate).format("DD.MM.YYYY");
        var eventsArray = self.events()[key];


        for(var i = 0; i < eventsArray.length; i++ ){
            
            if(eventsArray[i]._id == eventObj._id){
            
                eventsArray.splice(i,1);
            
            }
        }

        self.events()[key] = eventsArray;

    };

    // This function is used to sort an array of events (just do array.sort(self.orderEvents)
    self.orderEvents = function(event1, event2){
        if (event1.startDate > event2.startDate) return 1;
        if (event1.startDate < event2.startDate) return -1;
        return 0;
    };





    // Initialize the ViewModal
    self.CalendarsInit();
    self.EventsInit();
    self.loadAllData();
    

    
}

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

/**
 * ViewModel to show events to the user
 */




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


function handleImage(files) {
    for (var i = 0; i < files.length; i++) {
    var file = files[i];

    console.log(file);
    var imageType = /image.*/;
     
     
    var img = document.getElementById("newCalendarPhoto");
    img.file = file;

    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
}





ko.applyBindings(new ApplicationViewModel());




