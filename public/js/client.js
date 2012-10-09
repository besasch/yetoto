
/**
 * Event class to create consistend event objects in the whole application
 */
function Event(title, content, startDate, endDate, location, _calendar, creationTime, modificationTime, owner) {
    var self = this;

    self.title = title;
    self.content = content;
    self.startDate = startDate;

    self.endDate = endDate;
    self.location = location;
    self._calendar = _calendar;
    self.creationTime = creationTime;
    self.modificationTime = modificationTime;
    self.owner = owner;

    /*self.startTime = ko.computed(function() {
        return moment(self.startDate).format('HH:mm');
    }, self);

    self.endTime = ko.computed(function() {
        return moment(self.endDate).format('HH:mm');
    }, self);*/
}

/**
 * ViewModel to show events to the user
 */
function EventViewModel() {
    var self = this;

    // Data
    self.todaysDate = moment(); // Contains today's date
    self.shownDay = ko.observable(); // // Contains the date of the day shown on the frontend
    self.shownDayFormatted = ko.computed(function(){ // Contains the formatted date
        return moment(self.shownDay()).format("DD.MM.YYYY");
    });

    self.events = ko.observableArray([
        new Event("Event 1", "Body 1", moment()),
        new Event("Event 2", "Body 2", moment())
    ]);

    self.newEventContainer = ko.observable();
    self.chosenEventContainer = ko.observable();

    // Behaviour

    /*
     * Adds a new Event to the array and to the server
     * This function gets its data from the container variable newEventContainer
     */
    self.addEvent = function() {
        console.log("ajax post get event from container");
        // Get the new event out of the container variable
        newEvent = new Event(self.newEventContainer().title, self.newEventContainer().content,
            self.newEventContainer().startDate, self.newEventContainer().endDate, self.newEventContainer().location,
            self.newEventContainer()._calendar);
        console.log("ajax post got event! "+JSON.stringify(newEvent));
        // Empty the container variable
        self.newEventContainer(null);

        // Send the event to the server
        $.ajax({
            type: 'POST',
            url: '/data/'+ newEvent._calendar +'/event',
            data: {data: newEvent},
            dataType: "json",
            success: function() {
                // Push the event into the view array when done
                self.events.push(newEvent);
                // Close Modal when done
                $('#NewEventModal').modal('hide');
                console.log("ajax post done");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    };

    self.goToTomorrow = function() {
        self.shownDay(moment(self.shownDay()).add('days', 1)); // Set shownDate to the next day
        self.loadEvents(); // Load the events again
    };

    self.goToYesterday = function() {
        self.shownDay(moment(self.shownDay()).subtract('days', 1)); // Set shownDate to the next day
        self.loadEvents(); // Load the events again
    };

    /*
     * Shows a modal to the user for adding a new event
     */
    self.goToNewEvent = function() {
        self.newEventContainer(new Event("", "" , moment(), moment(), "location", "5072f3092b788f282e000002"));
        $('#NewEventModal').modal('show');
    };


    /*
     * Shows a modal to the user containing all data for a specific event
     */
    self.goToEvent = function(chosenEvent) {
        self.chosenEventContainer(chosenEvent);
        $('#ShowEventModal').modal('show');
    };


    // Background Behaviour

    /*
     * Initialize the app with relevant data
     */
    self.init = function(){
        self.shownDay(self.todaysDate); // Set shownDate to today's date
        self.loadEvents(); // Load the events
    };

    /*
     * Load a date's events from the server
     */
    self.loadEvents = function(){

        // Clear the array first
        self.events(null);

        // Get the date to show
        date = self.shownDay();

        // Ripp the date parameter apart and build the server Url with it
        year = moment(date).year();
        month = moment(date).month()+1;
        day = moment(date).date();
        serverUrl = "/data/"+year+"/"+month+"/"+day;

        // Load initial state from server, convert it to instances
        // of the Event class, then populate self.events‚
        $.getJSON(serverUrl, function(allData) {
            console.log("Ajax Data: " + JSON.stringify(allData.data.events));
            var mappedEvents = $.map(allData.data.events, function(item) {
                return new Event(item);
            });
            self.events(mappedEvents);
        });
    };

    // Initialize the EventsViewModel
    self.init();
}

ko.applyBindings(new EventViewModel());