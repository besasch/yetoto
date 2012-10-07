function Event(title, body, startDate) {
    var self = this;
    self.title = title;
    self.body = body;
    self.startDate = startDate;

    self.startTime = ko.computed(function() {
        return moment(self.startDate).format('HH:mm');
    }, self);
}

function EventViewModel() {
    var self = this;

    // Data
    self.now = moment();
    self.shownDay = ko.computed(function(){
        return moment(self.now).format("DD.MM.YYYY");
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

    self.goToNewEvent = function() {
        self.newEventData(new Event("", "" , moment()));
        //console.log("goto");
        $('#NewEventModal').modal('show');
    };

    self.goToEvent = function(chosenEvent) {
        self.chosenEventData(chosenEvent);
        $('#ShowEventModal').modal('show');
    };


    // Background Behaviour
    self.init = function(){
        self.load(self.now);
    }

    self.load = function(date){

        year = moment(date).year();
        month = moment(date).month()+1;
        day = moment(date).date();

        // Load initial state from server, convert it to Task instances, then populate self.events‚
        $.getJSON("/data/"+year+"/"+month+"/"+day, function(allData) {
            var mappedEvents = $.map(allData, function(item) {
                console.log("Load Ajax");
                return new Event(item);
            });
            self.events(mappedEvents);
        });

    }

    self.init();

}

ko.applyBindings(new EventViewModel());