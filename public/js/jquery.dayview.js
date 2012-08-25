(function( $ ) {
  $.fn.dayview = function(options) {

	var that = this;
	var settings = $.extend( {
		siteUrl: "http://www.yeto.to:3000"
		// Set options for plugin here...
    }, options);

	// Actual dates:
    var today = moment().format("DD.MM.YYYY");
    var yesterday = moment().subtract('days', 1).format("DD.MM.YYYY");
    var tomorrow = moment().add('days', 1).format("DD.MM.YYYY");

    // Relative to the shown day:
	var currentDate = $('.date-controls h3').text();
	var currentUrl = "http://" + window.location.hostname + window.location.pathname;

	// UI Elements

	function renderEventModal(item){

		clearModal();
		$('#Modal .modal-header h3').text(item.title);
		$('#Modal .modal-body').append($('<p>').text(item.body));
	}

	function renderTextField(id, name, label){

		return ('<div class="control-group">' + 
                    '<label class="control-label" for="' + id + '">' + label + '</label>' +
                    '<div class="controls">' +
                        '<input type="text" class="input-xlarge" name="' + name + '" id="' + id + '" />' +
                    '</div>' +
                '</div>')
	}

	function renderTextArea(id, name, label){

		return ('<div class="control-group">' + 
                    '<label class="control-label" for="' + id + '">' + label + '</label>' +
                    '<div class="controls">' +
                        '<textarea type="text" class="input-xlarge" name="' + name + '" id="' + id + '" />' +
                    '</div>' +
                '</div>')
	}

	function renderDatepicker(label, timeId, timeName, timeLabel, dateId, dateName, dateLabel){

		return ('<div class="control-group">' +
                    '<label class="control-label" for="' + dateId + '"> ' + label + ' </label>' +
                    '<div class="controls">' +
                        '<input data-datepicker="datepicker" type="text" class="input-small" name="'+ dateName +'" id="' + dateId + '" placeholder="' + dateLabel + '"/>' +
                        '<input type="text" class="input-small" name="' + timeName + '" id="' + timeId + '" placeholder="' + timeLabel + '"/>' +
                    '</div>' +
                '</div>')
	}

	function renderAddEventModal(calendarId){

		clearModal();
		$('#Modal .modal-header h3').text("Add Event");

		$('#Modal .modal-body').append($('<form/>', {
			name: 'addEvent',
			action: '/calendars/' + calendarId + '/events',
			method: 'post',
			class: 'form-horizontal',
			html:
			$('<fieldset/>', {
				html: 
				renderTextField('title', 'title', 'Title') +
				renderTextArea('body', 'body', 'Content') +
				renderDatepicker('Starting', 'starttime','starttime','Time', 'startdate', 'startdate', 'Date') +
				renderDatepicker('Finishing', 'endtime','endtime','Time', 'enddate', 'enddate', 'Date') +
				renderTextField('location', 'location', 'Location') +
				'<input type="submit" value="Submit" class="btn btn-info"/>'
			})
		}));
	}

	function renderDeleteCalendarModal(calendarId){

		clearModal();
		$('#Modal .modal-header h3').text("Delete Calendar");

		$('#Modal .modal-body').text('Are you sure you want to delete this calender?');

		$('#Modal .modal-footer').append($('<form/>', {
			name: 'deleteCalendar',
			action: '/calendars/' + calendarId + '/delete',
			method: 'post',
			class: 'form-horizontal',
			html:
			$('<fieldset/>', {
				html:  
				'<input type="submit" value="Yes, delete it!" class="btn btn-info"/>'
			})
		}));
	}



	function closeDropdowns(){
		$('.dropdown.open').removeClass('open');
	}

	function clearModal(){

		$('#Modal .modal-header h3').empty();
		$('#Modal .modal-body').empty();
		$('#Modal .modal-footer').empty();
	}

	function createEventElement(item) {
		return $('<div>').addClass('event').attr('id', item._id)
			.append($('<a>').attr('href','').click(function(event) {
				//event.preventDefault();
				loadEvent(item._id);
				$('#Modal').modal('show');
				return false;
			}).append($('<span>').addClass('fulllink'))
			)
			.append($('<img>').attr('src', item._calendar.picture))
			.append($('<span>').addClass('time').text(moment(item.startTime).format("HH:mm")))
			.append($('<div>').addClass('controls')
				//Append them controls here..
			)
			.append($('<div>').addClass('headline')
				.append($('<h3>').text(item.title))
			)
    }

    function createEmptyElement(message) {
		return 
		$(this).text(message);
    }

    // Ajax Calls

    function loadEvent(eventId){

		console.log(eventId);

		var dataUrl = settings.siteUrl + "/data/events/" + eventId;
		var browserUrl = settings.siteUrl + "/events/" + eventId;

		$.ajax( dataUrl, {
			type: "GET",
			dataType: "json",
			cache: false
		}).done(function(data, success_code, jqXHR){
			if (data.data !== null && data.data.eventItem !== null) {

				var eventItem = data.data.eventItem;
				
				renderEventModal(eventItem);

				//to change the browser URL to the given link location
				if(browserUrl!=currentUrl){
					window.history.pushState({path:browserUrl},'',browserUrl);
				}
			} else {
			that.append(createEmptyElement("No event found!"));
		}

		}).fail(function(jqXHR, error_code, exception){
			that.append(createEmptyElement(error_code + ": " + exception));      

		}).always(function(jqXHR, response_code){
		// no op
		});   

    }

	function loadDayView(inputDate){

		that.empty();

		var year = moment(inputDate, "DD.MM.YYYY").year();
		var month = moment(inputDate, "DD.MM.YYYY").month() + 1;
		var day = moment(inputDate, "DD.MM.YYYY").date();

		var dataUrl = "http://www.yeto.to:3000/data/" + year + "/" + month + "/" + day
		var browserUrl = "http://www.yeto.to:3000/day/" + year + "/" + month + "/" + day



		$.ajax( dataUrl, {
			type: "GET",
			dataType: "json",
			cache: false
		}).done(function(data, success_code, jqXHR){
			if (data.data !== null && data.data.events !== null) {
				for (var i=0; i < data.data.events.length; i++) {
					var event = data.data.events[i];
					that.append(createEventElement(event));
				}
				$('.date-controls h3').text(inputDate);
				currentDate = data.data.date;
				//to change the browser URL to the given link location
				if(browserUrl!=currentUrl){
					window.history.pushState({path:browserUrl},'',browserUrl);
				}
			} else {
			that.append(createEmptyElement("No event found!"));
		}

		}).fail(function(jqXHR, error_code, exception){
			that.append(createEmptyElement(error_code + ": " + exception));      

		}).always(function(jqXHR, response_code){
		// no op
		});    
	}

	// Change day on dayview:

	$("#yesterday").click(function(event) {
		var dayBefore = moment(currentDate, "DD.MM.YYYY").subtract('days', 1).format("DD.MM.YYYY");
		loadDayView(dayBefore);
		return false;
	});

	$("#tomorrow").click(function(event) {
		var nextDay = moment(currentDate, "DD.MM.YYYY").add('days', 1).format("DD.MM.YYYY");
		loadDayView(nextDay);
		return false;
	});

	$(document).keydown(function(e){
		if (e.keyCode == 37) { 
			var dayBefore = moment(currentDate, "DD.MM.YYYY").subtract('days', 1).format("DD.MM.YYYY");
			loadDayView(dayBefore);
			return false;
		}
	});

	$(document).keydown(function(e){
		if (e.keyCode == 39) { 
			var nextDay = moment(currentDate, "DD.MM.YYYY").add('days', 1).format("DD.MM.YYYY");
			loadDayView(nextDay);
			return false;
		}
	});

	$('a.addEvent').click(function(event) {
		event.preventDefault();

		var calendarId = $(this).attr('href');
		//console.log(calendarId);
		closeDropdowns();
		renderAddEventModal(calendarId);
		$('#Modal').modal('show');
		return false;
	})
	
		
		$('a.deleteCalendar').click(function(calendar) {
		calendar.preventDefault();
		console.log('komisch');
		
		var calendarId = $(this).attr('href');
		console.log(calendarId);
		closeDropdowns();
		renderDeleteCalendarModal(calendarId);
		$('#Modal').modal('show');  //Event Modal vorerst missbrauchen
		return false;
		
	})

	// init the view:
	loadDayView(currentDate);

	
	

  };

})( jQuery );