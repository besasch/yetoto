
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
    self._calendar = calendar;
    self.creationTime = creationTime;
    self.modificationTime = modificationTime;
    self.owner = owner;

    self.startTime = ko.computed(function() {
        return moment(self.startDate).format('HH:mm');
    }, self);

    self.endTime = ko.computed(function() {
        return moment(self.endDate).format('HH:mm');
    }, self);
}

/**
 * ViewModel to show events to the user
 */
function EventViewModel() {
    var self = this;

    // Data
    self.todaysDate = moment(); // Contains today's date
    self.shownDay = ko.computed(function(){ // Contains the date of the day shown on the frontend
        return moment(self.todaysDate).format("DD.MM.YYYY");
    })

    self.events = ko.observableArray([
        new Event("Event 1", "Body 1", moment()),
        new Event("Event 2", "Body 2", moment())
    ]);

    self.newEventData = ko.observable();
    self.chosenEventData = ko.observable();

    // Becaviour
    self.addEvent = function() {
        self.events.push(new Event(self.newEventData().title, self.newEventData().body, self.newEventData().startDate));
        console.log("new");
        self.newEventData(null);
        $('#NewEventModal').modal('hide');
    };

    /*
     * Shows a modal to the user for adding a new event 
     */
    self.goToNewEvent = function() {
        self.newEventData(new Event("", "" , moment()));
        $('#NewEventModal').modal('show');
    };


    /*
     * Shows a modal to the user containing all data for a specific event 
     */
    self.goToEvent = function(chosenEvent) {
        self.chosenEventData(chosenEvent);
        $('#ShowEventModal').modal('show');
    };


    // Background Behaviour

    /*
     * Initialize the app with relevant data
     */
    self.init = function(){
        self.loadEvents(self.todaysDate);
    }

    /*
     * Load a date's events from the server
     */
    self.loadEvents = function(date){

        // Ripp the date parameter apart and build the server Url with it
        year = moment(date).year();
        month = moment(date).month()+1;
        day = moment(date).date();
        serverUrl = "/data/"+year+"/"+month+"/"+day;

        // Load initial state from server, convert it to instances 
        // of the Event class, then populate self.events‚
        $.getJSON(serverUrl, function(allData) {
            var mappedEvents = $.map(allData, function(item) {
                console.log("Load Ajax");
                return new Event(item);
            });
            self.events(mappedEvents);
        });

    }

    // Initialize the EventsViewModel
    self.init();
}

ko.applyBindings(new EventViewModel());