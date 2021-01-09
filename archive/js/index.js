$(document).ready(function() {
	'use strict';

	const START_YEAR = 2021;

	const AUTO_PLAY_STATUS = {
		STOP : 0,
		PLAY : 1,
		REVERSE : 2
	};

	const ANIMATION_DURATION = 100;
	const ANIMATION_DURATION_AUTO = 200;

	const KEY_CODE_LEFT = 37;
	const KEY_CODE_RIGHT = 39;

	var autoPlayTimer;
	var isPlaying = false;
	var isNormalPlay = true;
	var autoPlayStatus = AUTO_PLAY_STATUS.STOP;

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
	$(this).keydown(function(event) {
		switch (event.keyCode) {
			case KEY_CODE_LEFT:
				stopAutoPlay();
				prevHour();
				break;
			case KEY_CODE_RIGHT:
				stopAutoPlay();
				nextHour();
				break;
			default:
				break;
		}
	});

	$('input[name=area]').change(function() {
		stopAutoPlay();
		resetGpvImage();
	});

	$('input[name=type]').change(function() {
		stopAutoPlay();
		resetGpvImage();
	});

	$('select[name=year]').change(function() {
		stopAutoPlay();
		resetGpvImage();
	});

	$('select[name=month]').change(function() {
		stopAutoPlay();
		const year = $('select[name=year] > option:selected').val();
		const month = $('select[name=month] > option:selected').val()
		initDayOptions(year, month);
		resetGpvImage();
	});

	$('select[name=day]').change(function() {
		stopAutoPlay();
		resetGpvImage();
	});

	$('select[name=hour]').change(function() {
		stopAutoPlay();
		resetGpvImage();
	});

	$('#PrevButton').click(function() {
		if ($('input[name=autoplay]').prop('checked')) {
			clearTimeout(autoPlayTimer);
			switch (autoPlayStatus) {
				case AUTO_PLAY_STATUS.STOP:
				case AUTO_PLAY_STATUS.PLAY:
					autoPlayStatus = AUTO_PLAY_STATUS.REVERSE;
					isNormalPlay = false;
					autoPlay();
					$('#NextButton').removeClass('Pause');
					$('#NextButton').addClass('Play');
					$(this).removeClass('Play');
					$(this).addClass('Pause');
					break;
				case AUTO_PLAY_STATUS.REVERSE:
					stopAutoPlay();
				default:
					break;
			}
		} else {
			prevHour();
		}
	});

	$('#NextButton').click(function() {
		if ($('input[name=autoplay]').prop('checked')) {
			clearTimeout(autoPlayTimer);
			switch (autoPlayStatus) {
				case AUTO_PLAY_STATUS.STOP:
				case AUTO_PLAY_STATUS.REVERSE:
					autoPlayStatus = AUTO_PLAY_STATUS.PLAY;
					isNormalPlay = true;
					autoPlay();
					$('#PrevButton').removeClass('Pause');
					$('#PrevButton').addClass('Play');
					$(this).removeClass('Play');
					$(this).addClass('Pause');
					break;
				case AUTO_PLAY_STATUS.PLAY:
					stopAutoPlay();
				default:
					break;
			}
		} else {
			nextHour();
		}
	});

	$('input[name=autoplay]').change(function() {
		$('select[name=speed]').attr('disabled', !$(this).prop('checked'));
		stopAutoPlay();
	});

	$('select[name=speed]').change(function() {
		if ($('input[name=autoplay]').prop('checked')) {
			switch (autoPlayStatus) {
				case AUTO_PLAY_STATUS.PLAY:
				case AUTO_PLAY_STATUS.REVERSE:
					clearTimeout(autoPlayTimer);
					autoPlay();
				case AUTO_PLAY_STATUS.STOP:
				default:
					break;
			}
		}
	});

	//
	// functions
	//
	function prevHour() {
		var currentElement = $('select[name=hour] > option:selected');
		var newElement = currentElement.prev('option');
		if (newElement.length === 0) {
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
		if (newElement.length === 0) {
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
		if (newElement.length === 0) {
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
		if (newElement.length === 0) {
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
		if (newElement.length === 0) {
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
		if (newElement.length === 0) {
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
		if (newElement.length === 0) {
			return false;
		} else {
			$('select[name=year]').val(newElement.val());
			return true;
		}
	}

	function nextYear() {
		var currentElement = $('select[name=year] > option:selected');
		var newElement = currentElement.next('option');
		if (newElement.length === 0) {
			return false;
		} else {
			$('select[name=year]').val(newElement.val());
			return true;
		}
	}

	function initYearOptions() {
		const thisYear = (new Date()).getFullYear();
		for (var i = START_YEAR; i <= thisYear; i++) {
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

		if (prevDay !== null) {
			if (prevDay > lastDay[month]) {
				prevDay = lastDay[month];
			}
			$('select[name=day]').val(prevDay);
		}
	}

	function initDateSelect() {
		var now = new Date();
		now.setHours(now.getHours() - now.getHours() % 3 - 1);
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const day = now.getDate();
		const hour = now.getHours();
		$('select[name=year]').val(year);
		$('select[name=month]').val(month);
		$('select[name=day]').val(day);
		$('select[name=hour]').val(hour);
	}

	function resetGpvImage() {
		const area = $('input[name=area]:checked').val();
		const type = $('input[name=type]:checked').val();
		const year = $('select[name=year]').val();
		const month = toDoubleDigits($('select[name=month]').val());
		const day = toDoubleDigits($('select[name=day]').val());
		const hour = toDoubleDigits($('select[name=hour]').val());
		const delay = autoPlayStatus === AUTO_PLAY_STATUS.STOP ? ANIMATION_DURATION : ANIMATION_DURATION_AUTO;

		const path = 'images/' + type + '/' + area + '/' + year + '/' + month + '/' + day + '/'
			+ 'msm_' + type + '_' + area + '_' + year + month + day + hour + '.png';
		//console.log(path);

		$('#GpvImage').append('<div></div>');
		$('#GpvImage > div').last().css('animation-duration', delay + 'ms');
		$('#GpvImage > div').last().css('background-image', 'url(' + path + ')');
		$('#GpvImage > div').first().delay(delay).queue(function() {
			$(this).remove();
		})
	}

	function autoPlay() {
		const interval = $('select[name=speed] > option:selected').val();
		autoPlayTimer = setTimeout(function() {
			isNormalPlay ? nextHour() : prevHour();
			autoPlay();
		}, interval);
	}

	function stopAutoPlay() {
		autoPlayStatus = AUTO_PLAY_STATUS.STOP;
		clearTimeout(autoPlayTimer);
		$('#PrevButton').removeClass('Pause');
		$('#PrevButton').addClass('Play');
		$('#NextButton').removeClass('Pause');
		$('#NextButton').addClass('Play');
	}

	function toDoubleDigits(n) {
		n += '';
		if (n.length === 1) {
			n = "0" + n;
		}
		return n;
	}

});
