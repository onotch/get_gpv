$(document).ready(function() {
	'use strict';

	const LATEST_YEAR = 2021;

	//
	// initialize
	//
	initYearOptions();
	initDayOptions((new Date()).getFullYear(), (new Date()).getMonth() + 1);
	initDateSelect();
	resetGpvImage();

	//
	// events
	//
	$('input[name=area]').change(function() {
		resetGpvImage();
	});

	$('input[name=type]').change(function() {
		resetGpvImage();
	});

	$('select[name=year]').change(function() {
		resetGpvImage();
	});

	$('select[name=month]').change(function() {
		const year = $('select[name=year] > option:selected').val();
		const month = $('select[name=month] > option:selected').val()
		initDayOptions(year, month);
		resetGpvImage();
	});

	$('select[name=day]').change(function() {
		resetGpvImage();
	});

	$('select[name=hour]').change(function() {
		resetGpvImage();
	});

	$('#PrevButton').click(function() {
		prevHour();
	});

	$('#NextButton').click(function() {
		nextHour();
	});

	//
	// functions
	//
	function prevHour() {
		var currentElement = $('select[name=hour] > option:selected');
		var newElement = currentElement.prev('option');
 		if (newElement.length == 0) {
 			if (prevDay()) {
				newElement = $('select[name=hour] > option').last();
 			} else {
 				return;
 			}
		}
		$('select[name=hour]').val(newElement.val());
		resetGpvImage();
	}

	function nextHour() {
		var currentElement = $('select[name=hour] > option:selected');
		var newElement = currentElement.next('option');
 		if (newElement.length == 0) {
 			if (nextDay()) {
				newElement = $('select[name=hour] > option').first();
			} else {
				return;
			}
		}
		$('select[name=hour]').val(newElement.val());
		resetGpvImage();
	}

	function prevDay() {
		var currentElement = $('select[name=day] > option:selected');
		var newElement = currentElement.prev('option');
 		if (newElement.length == 0) {
 			if (prevMonth()) {
				newElement = $('select[name=day] > option').last();
 			} else {
				return false;
			}
		}
		$('select[name=day]').val(newElement.val());
		return true;
	}

	function nextDay() {
		var currentElement = $('select[name=day] > option:selected');
		var newElement = currentElement.next('option');
 		if (newElement.length == 0) {
 			if (nextMonth()) {
				newElement = $('select[name=day] > option').first();
			} else {
				return false;
			}
		}
		$('select[name=day]').val(newElement.val());
		return true;
	}

	function prevMonth() {
		var currentElement = $('select[name=month] > option:selected');
		var newElement = currentElement.prev('option');
 		if (newElement.length == 0) {
 			if (prevYear()) {
				newElement = $('select[name=month] > option').last();
			} else {
				return false;
			}
		}
		$('select[name=month]').val(newElement.val());
		const year = $('select[name=year] > option:selected').val();
		initDayOptions(year, newElement.val());
		return true;
	}

	function nextMonth() {
		var currentElement = $('select[name=month] > option:selected');
		var newElement = currentElement.next('option');
 		if (newElement.length == 0) {
 			if (nextYear()) {
				newElement = $('select[name=month] > option').first();
			} else {
				return false;
			}
		}
		$('select[name=month]').val(newElement.val());
		const year = $('select[name=year] > option:selected').val();
		initDayOptions(year, newElement.val());
		return true;
	}

	function prevYear() {
		var currentElement = $('select[name=year] > option:selected');
		var newElement = currentElement.prev('option');
 		if (newElement.length == 0) {
 			return false;
		} else {
			$('select[name=year]').val(newElement.val());
			return true;
		}
	}

	function nextYear() {
		var currentElement = $('select[name=year] > option:selected');
		var newElement = currentElement.next('option');
 		if (newElement.length == 0) {
 			return false;
		} else {
			$('select[name=year]').val(newElement.val());
			return true;
		}
	}

	function initYearOptions() {
		const thisYear = (new Date()).getFullYear();
		for (var i = LATEST_YEAR; i <= thisYear; i++) {
			$('select[name=year]').append('<option value="' + i + '">' + i + '</option>');
		}
	}

	function initDayOptions(year, month) {
		var lastDay = new Array('', 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
			lastDay[2] = 29;
		}

		var prevDay = null;
		if ($('select[name=day] > option').length > 0) {
			prevDay = $('select[name=day] > option:selected').val();
			$('select[name=day]').empty();
		}

		for (var i = 1; i <= lastDay[month]; i++) {
			$('select[name=day]').append('<option value="' + i + '">' + i + '</option>');
		}

		if (prevDay != null) {
			if (prevDay > lastDay[month]) {
				prevDay = lastDay[month];
			}
			$('select[name=day]').val(prevDay);
		}
	}

	function initDateSelect() {
		var now = new Date();
		now.setHours(now.getHours() - 3);
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const day = now.getDate();
		const hour = now.getHours();
		$('select[name=year]').val(year);
		$('select[name=month]').val(month);
		$('select[name=day]').val(day);
		$('select[name=hour]').val(hour);
	}

	function toDoubleDigits(n) {
		n += "";
		if (n.length === 1) {
			n = "0" + n;
		}
		return n;
	}

	function resetGpvImage() {
		const area = $('input[name=area]:checked').val();
		const type = $('input[name=type]:checked').val();
		const year = $('select[name=year]').val();
		const month = toDoubleDigits($('select[name=month]').val());
		const day = toDoubleDigits($('select[name=day]').val());
		const hour = toDoubleDigits($('select[name=hour]').val());

		const path = "images/" + type + "/" + area + "/" + year + "/" + month + "/" + day + "/"
			+ "msm_" + type +  "_" + area + "_" + year + month + day + hour + ".png";
		//console.log(path);

		$('#GpvImage').css('background-image', 'url(' + path + ')');
	}

});
