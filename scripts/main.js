Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}


var p1 = {
	token: '\u2573',
	history: []
};

var p2 = {
	token: '\u25ef',
	history: []
}

var current_player = p1;
var turn = 1;

var board = [null,null,null,null,null,null,null,null,null];



function playGame(){
	$('#current_player').text(current_player.token+"'s turn!");
	
	$('.box').on('click',function(){
		var location = parseInt($(this).attr('id')[1]);
		if(isValidMove(location)){
		board[location] = current_player.token;
		current_player.history.push(location);
		if(checkWin(current_player.history)===true){
			render();
			$('.box').off('click');
			$('#current_player').empty();
			$('#message').text(current_player.token + ' wins!');
			$('#directions-container').slideDown();
		} else if (turn===9){
			render();
			$('.box').off('click');
			$('#current_player').empty();
			$('#message').text("It's a draw!");
			$('#directions-container').slideDown();
		}	else{
				turn++;
				if(turn%2==1){
					current_player = p1;
				} else{
					current_player = p2;
				}
			
				$('#current_player').text(current_player.token+"'s turn!");
				render();
			}

		}
		
	});
};

function isValidMove(location){
	valid = false
	if(board[location]===null){
		valid = true;
	}

	return valid;

}


function render(){
	$('.box').empty();
	for(i=0;i<board.length;i++){
		$('#b'+i).append(board[i]);
	}
	
};

function checkWin(player_history){
	win_array=[[0,1,2], [0,4,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6], [3,4,5], [6,7,8]]
	win = false;

	for(i=0;i<win_array.length;i++){
		intersection = intersect(win_array[i],player_history).unique().sort();
		if(arraysEqual(intersection,win_array[i])){
			win = true;
		}
	}

	return win;

}

function playComputer(){
	$('#current_player').text('Try to beat the computer!');
	
	$('.box').on('click',function(){
		var location = parseInt($(this).attr('id')[1]);
		if(isValidMove(location)){
		board[location] = p1.token;
		p1.history.push(location);
		optimal(p1.history,p2.history);
		if(checkWin(p1.history)===true){
			render();
			$('.box').off('click');
			$('#current_player').empty();
			$('#message').text('You beat the computer! Wow!');
			$('#directions-container').slideDown();
		} else if (turn===9){
			render();
			$('.box').off('click');
			$('#current_player').empty();
			$('#message').text("It's a draw!");
			$('#directions-container').slideDown();
		}	else{
				turn+=2
				console.log(turn);
				optimal_move = optimal(p1.history,p2.history);
				board[optimal_move] = p2.token;
				p2.history.push(optimal_move);

				if(checkWin(p2.history)===true){
					render();
					$('.box').off('click');
					$('#current_player').empty();
					$('#message').text('The computer crushed you!');
					$('#directions-container').slideDown();
				}
			
				
				render();
			}

		}
		
	});
}

function optimal(player_history, computer_history){
	win_array=[[0,1,2], [0,4,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6], [3,4,5], [6,7,8]];
	win_possible=false;
	to_win=0;
	need=[];

	for(i=0;i<win_array.length;i++){
		intersection = intersect(computer_history, win_array[i]).unique();
		if(intersection.length === 2){
			need = win_array[i].diff(intersection);
			if(player_history.includes(need[0])===false){
				win_possible = true;
				to_win = need[0];
			}
		}
	}

	loss_possible = false;
	to_block = 0;
	for(i=0;i<win_array.length;i++){
		intersection = intersect(win_array[i],player_history);
		if(intersection.length ===2 && intersect(win_array[i],player_history.concat(computer_history).unique()).length<3){
			need = win_array[i].diff(intersection);
			to_block = need[0];
			if(computer_history.includes(to_block)===false){
				loss_possible = true;
			}
		}
	}

	if(win_possible===true){
		console.log('possible win');
		return to_win;
	} else if(loss_possible===true){
		console.log('possible loss')
		return to_block;
	} else if(arraysEqual(player_history.sort(),[0,8])){
		console.log('corner stuff 1');
		return 1;
	} else if (arraysEqual(player_history.sort(),[2,6])){
		console.log('corner stuff 2');
		return 1;
	} else if(player_history.includes(4)===false && computer_history.includes(4)===false){
		console.log('center is open');
		return 4;

	} else if(intersect([0,2,6,8],player_history.concat(computer_history).unique())){
		console.log('corner is open');
		return [0,2,6,8].diff(player_history.concat(computer_history).unique())[0];
	} else{
		console.log('random');
		return [0,1,2,3,4,5,6,7,8].diff(player_history.concat(computer_history).unique())[0];
		
	}
}

function reloadGame(){
	p1.history = [];
	p2.history = [];
	current_player = p1;
	turn = 1;
	board = [null,null,null,null,null,null,null,null,null];
	render();
}



$(document).ready(function(){

	$('#human').click(function(){
		$('#directions-container').slideUp();
		reloadGame();
		playGame();
	});

	$('#comp').click(function(){
		$('#directions-container').slideUp();
		reloadGame();
		playComputer();

	});

	
});



