// http://guilhemmarty.com/flippy//
// http://www.awwwards.com/touchswipe-a-jquery-plugin-for-touch-and-gesture-based-interaction.html

$(function(){
	function randomColor() {
		var letters = '012345'.split('');
		var color = '#';        
		color += letters[Math.round(Math.random() * 5)];
		letters = '0123456789ABCDEF'.split('');
		for (var i = 0; i < 5; i++) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color
	}
	
	var size = 320
	$('.cube').css({ width:size, height:size })
	var rotations = [
		{ x:0, y:0, c:'red' },
		{ x:90, y:0, c:'green' },
		{ x:0, y:90, c:'steelblue' },
		{ x:-90, y:0, c:'pink' },
		{ x:0, y:-90, c:'orange' },
		{ x:180, y:0, c:'magenta' }
	]
	$('.cube .side').each(function(i, el) {
		var rot = rotations[i]
		$(el).css({
			width: size,
			height: size,
			background: rot.c,
			WebkitTransform:'rotateX('+rot.x+'deg) rotateY('+rot.y+'deg) translateZ('+size/2+'px)'
		})
		
		var html = ''
		for (var d=0; d<4; d++) {
			html += '<div class="flipbox-container"><div class="flipbox"></div></div>'
		}

		$(el).html(html).find('.flipbox-container').css({
			width:size/2, height:size/2, 'float':'left'
		}).find('.flipbox').css({ width:size/2, height:size/2 })
		$(el).find('.flipbox-container').each(function(i, cardEl) {
			$(cardEl).css({ background:randomColor() })
		})
	})

	var dirToDirType = {
		'up': 'up/down',
		'down': 'up/down',
		'left': 'left/right',
		'right': 'left/right'
	}
	
	var dirTypeMirror = {
		'left/right': 'up/down',
		'up/down': 'left/right'
	}
	
	var dirToSign = {
		'up': 1,
		'down': -1,
		'left': -1,
		'right': 1
	}
	
	function swap(obj, propA, propB) {
		var valA = obj[propA]
		obj[propA] = obj[propB]
		obj[propB] = valA
	}
	
	var touch = (document.ontouchmove !== undefined)
	
	var viewport = {
		x: 0,
		y: 0,
		z: 0,
		el: $('.cube')[0],
		dirTypeToAxis: {
			'up/down': 'x',
			'left/right': 'y',
			'none': 'z'
		},
		move: function(dir) {
			var dirType = dirToDirType[dir]
			var sign = dirToSign[dir]

			var axis = this.dirTypeToAxis[dirType]
			this[axis] += sign * 90
			swap(this.dirTypeToAxis, 'none', dirTypeMirror[dirType])
			this.el.style['WebkitTransform'] = "rotateX("+this.x+"deg) rotateY("+this.y+"deg) rotateZ("+this.z+"deg)";
		}
	}

	var keyCodeToDir = {
		'37': 'left',
		'38': 'up',
		'39': 'right',
		'40': 'down'
	}

	$(document).keydown(function(evt) {
		if (keyCodeToDir[evt.keyCode]) {
			evt.preventDefault()
			viewport.move(keyCodeToDir[evt.keyCode])
		}
	})
	
	$('.cube').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			couldBeClick = false
			if (touch && fingerCount != 1) { return }
			viewport.move(direction)
		}
	});
	
	if (touch) {
		var couldBeClick = false
		$('.cube').on('touchstart', function(e) {
			couldBeClick = true
		})
		$('.cube').on('touchend', function(e) {
			setTimeout(function() {
				if (couldBeClick) {
					flip(e);
				}
			}, 50)
		})
	} else {
		$('.cube .side').on('click', function(e) {
			flip(e)
		})
	}
	
	function flip(e) {
		var $el = $(e.target)
		if ($el.hasClass('flipped')) {
			$el.removeClass('flipped').flippyReverse()
		} else {
			$el.addClass('flipped').flippy({ color_target:'red', verso:'flipped', depth:0.8 })
		}
	}
	
	$(document).on('touchstart', function($e) {
		$e.preventDefault()
	})
});