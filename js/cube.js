// http://guilhemmarty.com/flippy//

function shuffle(array) { // fisher yates
	var counter = array.length, temp, index;
	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

$(function(){
	var touch = (document.ontouchmove !== undefined)
	var traqball = new Traqball({ stage:'viewport' })
	var cardSize = 180
	var attemptsMade = 0
	
	var $selectedCards = []
	var matchesMade = 0

	var cardNumbers = []
	for (var i=0; i<24; i++) { cardNumbers.push(i + 1) }
	cardNumbers = shuffle(cardNumbers)
	
	var imgNames = [
		'img/ankylosaurus 310.jpg',
		'img/ankylosaurus skeleton 310.jpg',
		'img/brachiosaurus 310.jpg',
		'img/brachiosaurus skeleton 310.jpg',
		'img/dilophosaurus 310.jpg',
		'img/dilophosaurus skeleton 310.jpg',
		'img/pachycephalosaurus 310.jpg',
		'img/pachycephalosaurus skeleton 310.jpg',
		'img/parasaurolophus 310.jpg',
		'img/parasaurolophus skeleton 310.jpg',
		'img/plesiosaurus 310.jpg',
		'img/plesiosaurus skeleton 310.jpg',
		'img/pterodactyl 310.jpg',
		'img/pterodactyl skeleton 310.jpg',
		'img/rex 310.jpg',
		'img/rex skeleton 310.jpg',
		'img/spinosaurus 310.jpg',
		'img/spinosaurus skeleton 310.jpg',
		'img/stegosaurus 310.jpg',
		'img/stegosaurus skeleton 310.jpg',
		'img/triceratops 310.jpg',
		'img/triceratops skeleton 310.jpg',
		'img/velociraptor 310.jpg',
		'img/velociraptor skeleton 310.jpg'
	]
	
	
	preloadCardImages()
	function preloadCardImages() {
		var html = $.map(cardNumbers, function(i, cardNum) {
			return cardHtml(cardNum+1)
		}).join('\n')
		$(document.createElement('asd')).html(html).appendTo(document.body).css({
			position:'absolute',
			top:-999999,
			left:-999999
		})
	}
	
	function cardHtml(cardNum) {
		return '<img src="'+imgNames[cardNum-1]+'" width="'+cardSize/2+'"/>'
	}
	
	$('.cube').parent().append('<div id="status"></div>').find('#status').css({
		width: cardSize*1.6
	})
	updateStatus()

	var sides = [
		{ x:0, y:0, c:'red', t:'z' },
		{ x:90, y:0, c:'green', t:'y+' },
		{ x:0, y:90, c:'steelblue', t:'x+' },
		{ x:-90, y:0, c:'pink', t:'y-' },
		{ x:0, y:-90, c:'orange', t:'x-'  },
		{ x:180, y:0, c:'magenta', t:'z-' }
	]
	$('.cube').css({ width:cardSize, height:cardSize })
	var cardIndex = 0
	$('.cube .side').each(function(i, el) {
		var side = sides[i]
		$(el).css({
			width: cardSize,
			height: cardSize,
			textAlign: 'center',
			WebkitTransform:'rotateX('+side.x+'deg) rotateY('+side.y+'deg) translateZ('+cardSize/2+'px)'
		})
		
		var html = ''
		for (var d=0; d<4; d++) {
			var cardNumber = cardNumbers[cardIndex]
			html += '\
				<div class="flipbox-container" data-cardNumber="'+cardNumber+'">\
					<img class="flipbox" src="img/card-bg2.jpg" />\
				</div>\
			'
			cardIndex += 1
		}

		$(el).html(html).find('.flipbox-container').css({
			width:cardSize/2, height:cardSize/2, 'float':'left'
		}).find('.flipbox').css({ width:cardSize/2, height:cardSize/2 })
		$(el).find('.flipbox-container').each(function(i, cardEl) {
			$(cardEl).css({ background:'white' })
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
				selectCard(el)
			}
			$('.cube').off(eventNames.move)
			$('.cube').off(eventNames.end)
		})
	})
	
	function rand(arr) {
		return arr[Math.floor(Math.random() * arr.length)]
	}
	
	var flipDuration = 350
	function unselectCards() {
		$.each($selectedCards, function(i, $card) {
			$card.flippyReverse()
			setTimeout(function() {
				$card.removeClass('flipped').removeClass('badMatch')
			}, flipDuration)
		})
		$selectedCards = []
	}

	var unselectCardsTimer
	function selectCard(el) {
		if ($selectedCards.length == 2) {
			clearTimeout(unselectCardsTimer)
			unselectCards()
		}
		
		var $card = $(el)
		if ($card.hasClass('matched') || $card.hasClass('flipped')) {
			// Do nothing
		} else {
			$card.addClass('flipped').flippy({
				duration:flipDuration,
				color_target: "white",
				direction:rand(['RIGHT', 'LEFT', 'BOTTOM', 'TOP']),
				verso:cardHtml(cardNum($card)),
				depth:2,
				onFinish:function() {
					$selectedCards.push($card)
					if ($selectedCards.length == 2) {
						if (isMatchingSelectedCards()) {
							markMatchingSelectedCards()
						} else {
							$.each($selectedCards, function(i, $card) {
								$card.addClass('badMatch')
							})
							unselectCardsTimer = setTimeout(unselectCards, 1000)
						}
						attemptsMade += 1
						updateStatus()
					}
				}
			})
		}
	}
	
	// card numbers go from 1-N. Card pairs have adjacent numbers, e.g 1&2, 3&4, etc
	function cardNum($card) {
		return parseInt($card.attr('data-cardNumber'))
	}
	
	function isMatchingSelectedCards() {
		var num1 = cardNum($selectedCards[0])
		var num2 = cardNum($selectedCards[1])
		return Math.ceil(num1 / 2) == Math.ceil(num2 / 2)
	}
	
	function markMatchingSelectedCards() {
		$.each($selectedCards, function(i, $card) {
			$card.addClass('matched')
		})
		matchesMade += 1
		$selectedCards = []
	}
	
	function updateStatus() {
		var html
		if (!attemptsMade) {
			html = '<span class="greeting">DINO</br>MEMORY</span>'
		} else if (matchesMade != 12) {
			html = (
				matchesMade+' '+(matchesMade == 1 ? 'match' : 'matches')+'<br/> '+
				attemptsMade + ' '+(attemptsMade == 1 ? 'try' : 'tries')
			)
		} else {
			html = 'Boom! Done!<br/>In '+attemptsMade+' tries.'
		}
		$('#status').empty().html(html)
	}

	$(document).on('touchstart', function($e) {
		$e.preventDefault()
	})
});

