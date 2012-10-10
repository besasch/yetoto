/**
 * Event class to create consistend event objects in the whole application
 */

function Event(data) {
    var self = this;

    self.title = data.title;
    self.content = data.content;
    
    self.startDate = data.startDate;

    self.endDate = data.endDate;
    
    self.location = data.location;
    self._calendar = data._calendar;
    self.creationTime = data.creationTime;
    self.modificationTime = data.modificationTime;
    self.owner = data.owner;

    self.startTime = ko.computed(function() {
        return moment(self.startDate).format('HH:mm');
    }, self);

    self.endTime = ko.computed(function() {
        return moment(self.endDate).format('HH:mm');
    }, self);

    // Data to calculate start and enddate: PUT THIS IN ANOTHER FUNCTION??
    self.eventDate = ko.observable();
    self.eventStartTime = ko.observable();
    self.eventEndTime = ko.observable();
}

/**
 * ViewModel to show events to the user
 */

function EventViewModel() {
    var self = this;

    // Data
    self.todaysDate = moment(); // Contains today's date
    self.shownDay = ko.observable(); // // Contains the date of the day shown on the frontend
    self.shownDayFormatted = ko.computed(function() { // Contains the formatted date
        return moment(self.shownDay()).format("DD.MM.YYYY");
    });

    self.events = ko.observableArray(); // All the displayed events are in here
    self.newEventContainer = ko.observable();
    self.chosenEventContainer = ko.observable();

    // Behaviour


    /*
     * Shows a modal to the user for adding a new event
     */
    self.goToNewEvent = function() {
        // Create some dummy data
        dummy = {title: "", content: "", startDate: moment(), endDate: moment(),
        location: "", _calendar: "5072f3092b788f282e000002"};
        // Write the dummy data into the container
        self.newEventContainer(new Event(dummy));
        // Initiate timepickers
        $('.timepicker').timepicker();
        // Show the modal for the user to modify the data
        $('#NewEventModal').modal('show');
    };

    /*
     * Adds a new Event to the array and to the server
     * This function gets its data from the container variable newEventContainer
     */
    self.addEvent = function() {
        // Get the new event out of the container variable
        newEvent = new Event(self.newEventContainer());

        // Empty the container variable
        self.newEventContainer(null);

        // Send the event to the server
        $.ajax({
            type: 'POST',
            url: '/data/' + newEvent._calendar + '/newevent',
            data: {
                "data": JSON.stringify(newEvent)
            },
            dataType: "json",
            success: function() {
                // Push the event into the view array when done
                self.events.push(newEvent);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });

        // Close Modal
        $('#NewEventModal').modal('hide');
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
    self.init = function() {
        self.shownDay(self.todaysDate); // Set shownDate to today's date
        self.loadEvents(); // Load the events
    };

    /*
     * Load a date's events from the server
     */
    self.loadEvents = function() {

        // Clear the array first
        self.events(null);

        // Get the date to show
        date = self.shownDay();

        // Ripp the date parameter apart and build the server Url with it
        year = moment(date).year();
        month = moment(date).month() + 1;
        day = moment(date).date();
        serverUrl = "/data/" + year + "/" + month + "/" + day;

        // Load initial state from server, convert it to instances
        // of the Event class, then populate self.events‚
        $.ajax({
            url: serverUrl,
            dataType: 'json',
            success: function(data) {
                var mappedEvents = [];

                for(var i = 0; i < data.events.length; i++) {
                    mappedEvents.push(new Event(data.events[i]));
                }

                self.events(mappedEvents);
            }
        });

    };

    // Initialize the EventsViewModel
    self.init();
}

ko.applyBindings(new EventViewModel());