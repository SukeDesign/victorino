$(document).ready(function () {
	$("#addaJetSearchBox").search({ 
		websiteID: {{ admin_settings.addajet_website_id }}, 
		combinations: [ 
			"accommodation",
		], 
		settings: { 
		    languageCode: "{{ activeLocale }}",
		    {% if client_settings.booking_bar_hide_agencycode == 0 or client_settings.booking_bar_hide_promocode == 0 %}
		        showCodes: true,
		    {% else %}
		        showCodes: false,
		    {% endif %}
		    datePicker: { 
		        minimimNights: 1, 
		        minimumDate: 0, 
		        months: 2, 
		        format: "dd/mm/yy", 
		        fillDates: true 
		    }, 
		    accommodation: { 
		        showEstablishments: true 
		    } 
		}, 
		groups: { 
			accommodation: 
			{ 
				maxGroups:3,
				maxAdults: 4, 
				maxChildren: 3, 
				maxChildAge: 17 
			}, 
		}, 
		languages: { 
			searchBox: { 
				combinations: { 
					accommodation: "Accommodation", 
				}, 
				modules: { 
					accommodation: { 
						establishment: "Establishment", 
						dateFrom: "Check-in", 
						dateTo: "Check-out", 
						numberOfGroups: "Number of Rooms", 
						numberOfGroupsNumbers: ["1 Room", "2 Rooms", "3 Rooms", "4 Rooms", "5 Rooms", "6 Rooms","7 Rooms", "8 Rooms", "9 Rooms"], 
						groupNumbers: ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8","Room 9"], 
						adults: "Adults", 
						children: "Children", 
						childrenAges: "Children Ages", 
						checkAvailability: "Check Availability", 
						promoCode: "Promo Code", 
						agencyCode: "Agency Code", 
						agencyUsername: "Agency Username", 
						agencyPassword: "Agency Password" 
					}
				} 
			} 
		}

}); // search          
});	// ready