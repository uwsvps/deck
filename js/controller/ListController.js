
/*
 * @copyright Copyright (c) 2016 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *  
 */

app.controller('ListController', function ($scope, $location, $filter, BoardService, $element, $timeout) {
	$scope.boards = [];
	$scope.newBoard = {};
	$scope.status = {
		deleteUndo: []
	};
	$scope.colors = ['0082c9', '00c9c6','00c906', 'c92b00', 'F1DB50', '7C31CC', '3A3B3D', 'CACBCD'];
	$scope.boardservice = BoardService;
	$scope.newBoard.color = $scope.colors[0];

	// FIXME: not nice, but we want to load this only once
	if($element.attr('id') === 'app-navigation') {
		BoardService.fetchAll().then(function(data) {
			$scope.filterData();
		}, function (error) {
			// TODO: show error when loading fails
		});
	}

	$scope.filterData = function () {
		angular.copy($scope.boardservice.getData(), $scope.boardservice.sorted);
		$scope.boardservice.sorted = $filter('orderBy')($scope.boardservice.sorted, 'title');
	};

	$scope.selectColor = function(color) {
		$scope.newBoard.color = color;
	};

	$scope.boardCreate = function() {
		if(!$scope.newBoard.title || !$scope.newBoard.color) {
			$scope.status.addBoard=false;
			return;
		}
		BoardService.create($scope.newBoard)
			.then(function (response) {
				$scope.newBoard = {};
				$scope.newBoard.color = $scope.colors[0];
				$scope.status.addBoard=false;
				$scope.filterData();
			}, function(error) {
				$scope.status.createBoard = 'Unable to insert board: ' + error.message;
			});
	};

	$scope.boardUpdate = function(board) {
		BoardService.update(board).then(function(data) {
			$scope.filterData();
		});
		board.status.edit = false;
	};

	$scope.boardDelete = function(board) {
		var boardId = board.id;
		$scope.status.deleteUndo[boardId] = 10;
		$scope.boardDeleteCountdown = function () {
			console.log($scope.status);
			if($scope.status.deleteUndo[boardId] > 0) {
				$scope.status.deleteUndo[boardId]--;
				$timeout($scope.boardDeleteCountdown, 1000);
			}
			if($scope.status.deleteUndo[boardId] === 0) {
				BoardService.delete(board.id).then(function (data) {
					$scope.filterData();
				});
			}
		};
		$timeout($scope.boardDeleteCountdown, 1000);
	};

	$scope.boardDeleteUndo = function (board) {
		delete $scope.status.deleteUndo[board.id];
	};

});

