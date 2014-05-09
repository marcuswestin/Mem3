// http://guilhemmarty.com/flippy//

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

$(function(){
	var touch = (document.ontouchmove !== undefined)
	var traqball = new Traqball({ stage:'viewport' })
	var size = 180

	var sides = [
		{ x:0, y:0, c:'red', t:'z' },
		{ x:90, y:0, c:'green', t:'y+' },
		{ x:0, y:90, c:'steelblue', t:'x+' },
		{ x:-90, y:0, c:'pink', t:'y-' },
		{ x:0, y:-90, c:'orange', t:'x-'  },
		{ x:180, y:0, c:'magenta', t:'z-' }
	]
	$('.cube').css({ width:size, height:size })
	$('.cube .side').each(function(i, el) {
		var side = sides[i]
		$(el).css({
			width: size,
			height: size,
			textAlign: 'center',
			WebkitTransform:'rotateX('+side.x+'deg) rotateY('+side.y+'deg) translateZ('+size/2+'px)'
		})
		
		var html = ''
		for (var d=0; d<4; d++) {
			html += '<div class="flipbox-container"><img class="flipbox" src="img/card-bg.jpg" /></div>'
		}

		$(el).html(html).find('.flipbox-container').css({
			width:size/2, height:size/2, 'float':'left'
		}).find('.flipbox').css({ width:size/2, height:size/2 })
		$(el).find('.flipbox-container').each(function(i, cardEl) {
			$(cardEl).css({ background:randomColor() })
		})
	})
	
	var eventNames = (touch
		? { start:'touchstart', move:'touchmove', end:'touchend' }
		: { start:'mousedown', move:'mousemove', end:'mouseup' }
	)
	$('.cube').on(eventNames.start, function(e) {
		if (traqball.isSliding) {
			return
		}
		var didMove = false
		$('.cube').on(eventNames.move, function(e) {
			didMove = true
		})
		$('.cube').on(eventNames.end, function(e) {
			if (!didMove) {
				var el = e.target
				if (el.tagName == 'IMG') {
					el = el.parentNode
				}
				flip(el)
			}
			$('.cube').off(eventNames.move)
			$('.cube').off(eventNames.end)
		})
	})
	
	function rand(arr) {
		return arr[Math.floor(Math.random() * arr.length)]
	}
	
	function flip(el) {
		var $el = $(el)
		if ($el.hasClass('flipped')) {
			$el.removeClass('flipped').flippyReverse()
		} else {
			$el.addClass('flipped').flippy({
				color_target: "red",
				direction:rand(['RIGHT', 'LEFT', 'BOTTOM', 'TOP']),
				verso:'<img src="img/dino-1.jpg" width="'+size/2+'"/>',
				depth:2
			})
		}
	}
	
	$(document).on('touchstart', function($e) {
		$e.preventDefault()
	})
});