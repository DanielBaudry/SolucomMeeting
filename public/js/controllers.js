angular.module('starter.controllers', [])

.controller('RegisterCtrl', function ($scope, $state, $ionicLoading,$rootScope) {

  localStorage.removeItem("questionsAnswered");
  localStorage.removeItem("questionsImgResult");
  localStorage.removeItem("questionsNameResult");
  localStorage.setItem("registered", "false");

  $scope.user = {};
  $scope.error = {};
  var registered = localStorage.getItem("registered");
  var answeredAllQuestions = localStorage.getItem("answeredAllQuestions");

  console.log("in registered");
  
  //console.log("registered : " + registered + " answeredAllQuestions " + answeredAllQuestions);

  if ( registered == "true" )
  {
      //console.log("here registered true");
      if ( answeredAllQuestions == null || answeredAllQuestions == false )
      {
          //console.log("here go to quiz");
          $state.go('tab.quiz', {clear: true});
      }
      else
      {
          $state.go('score', {clear: true});
      }
  }
  else
  {
    $scope.register = function () {

      $ionicLoading.show({
        template: 'Inscription en cours...'
      });

      //console.log("username : "  + $scope.user.username + " email " + $scope.user.email);

      if ( (typeof $scope.user.username === "undefined" && typeof $scope.user.email === "undefined") || ($scope.user.username == "" && $scope.user.email == "") )
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un nom & un email';
          $scope.$apply();
      }
      else if (typeof $scope.user.email === "undefined" || $scope.user.email == "")
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un email';
          $scope.$apply();
      }
      else if ( typeof $scope.user.username === "undefined" || $scope.user.username == "")
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un nom';
          $scope.$apply();
      }
      else // The user can be registered
      {
		  // TODO: test signing user:
		  Parse.User.logIn($scope.user.username, "solucom", {
		  success: function(user) {
			// Do stuff after successful login.
			$ionicLoading.hide();
			$state.go('tab.quiz', {clear: true});
		  },
		  error: function(user, error) {
			// The login failed. Check error to see why.
			$ionicLoading.hide();
			$scope.error.message = 'Utilisateur inexistant';
			 $scope.$apply();
          }
		});
		//
      }
    };
  }
})

.controller('QuizCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading) {
	
	var Workshop = Parse.Object.extend("Workshop");
    var query = new Parse.Query(Workshop);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		$scope.workshops = results;
		$scope.$apply();
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
	
	$scope.loadWorkshop = function(number) {
		localStorage.setItem("workshop_number", number);
		$state.go('workshop', {clear: false});
	  };

})

.controller('WorkshopCtrl', function($scope, $state) {
	
	var number = localStorage.getItem("workshop_number");
	var Consultant = Parse.Object.extend("Consultant");
	var query = new Parse.Query(Consultant);
	query.equalTo('Workshop', parseInt(number, 10));
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		$scope.consultants = results;
		$scope.$apply();
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});

})

.controller('AboutCtrl', function($scope, $ionicPopup, $state) {

	var currentUser = Parse.User.current();
	var Consultant = Parse.Object.extend("Consultant");
	var query = new Parse.Query(Consultant);
	if( currentUser.get('Parrain') != null){
		query.get(currentUser.get('Parrain').id,{
		  success: function(results) {
			// Do something with the returned Parse.Object values
			$scope.parrain = results;
			$scope.$apply();
		  },
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});

		$scope.extfile = function() {
			var f = "../img/revue_VF.pdf";
			console.log(f);
			var ref = window.open(f, '_self', 'location=yes', 'closebuttoncaption=Return');
		  };
	}else{
		$scope.parrain = null;
	}
  
	
	$scope.feedback = function(itemAnswer) {

    $scope.data = {};

    var alertPopup = $ionicPopup.alert({
          title: '<h3>Vos impressions</h3>',
          template: '<textarea ng-model="data.feedbackText" placeholder="Commentaires" style="height:200px;"></textarea>',
          scope: $scope,
          buttons: [
            {
              text: '<b>Envoyer</b>',
              type: 'button-dark',
              onClick: function(e) {
                return $scope.data.feedbackText;
              }
            },
          ]
        });

    alertPopup.then(function(res) {

      var Feedback = Parse.Object.extend("Feedback");
      var feedback = new Feedback();
      var currentUser = Parse.User.current();

      feedback.set("text", $scope.data.feedbackText);
      feedback.set("email", currentUser.get("email"));

      feedback.save(null, {
        success: function(result) {
          // Execute any logic that should take place after the object is saved.
          console.log('New object created with objectId: ' + result.id);
        },
        error: function(result, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });

    });

  };

})

.controller('EndCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $ionicModal, $rootScope, $timeout) {
	var Consultant = Parse.Object.extend("Consultant");
    var query = new Parse.Query(Consultant);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		$scope.consultants = results;
		$scope.$apply();
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});

})

.controller('GalleryCtrl', function($scope, $state) {
	
	var Consultant = Parse.Object.extend("Consultant");
    var query = new Parse.Query(Consultant);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		$scope.consultants = results;
		$scope.$apply();
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
    
})

.controller('ChatCtrl', function($scope, $state) {

    var Message = Parse.Object.extend("Message");
    var query = new Parse.Query(Message);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		$scope.messages = results;
		$scope.$apply();
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
  
  $scope.message = function(data) {
	  var Message = Parse.Object.extend("Message");
      var message = new Message();
      var currentUser = Parse.User.current();

      message.set("text", data.messageText);
	  message.set("date", new Date());
      message.set("email", currentUser.get("email"));
	  message.set("username", currentUser.get("username"));
	  
	  data.messageText="";

    message.save(null, {
		success: function(result) {
		  // Execute any logic that should take place after the object is saved.
			var Message = Parse.Object.extend("Message");
			var query = new Parse.Query(Message);
			query.find({
			  success: function(results) {
				// Do something with the returned Parse.Object values
				$scope.messages = results;
				
				$scope.$apply();
			  },
			  error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			  }
			});
		},
		error: function(result, error) {
		  // Execute any logic that should take place if the save fails.
		  // error is a Parse.Error with an error code and message.
		  alert('Failed to create new object, with error code: ' + error.message);
		}
	});
  }
})

.controller('tabsCtrl', function($scope, $state) {

  $scope.endGame = function(){

    if ( typeof localStorage["questionsAnswered"] === "undefined" )
    {
        return "ng-show";
    }

    $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

    if ( $scope.questionsAnswered.length == 3 ) {
      return "ng-hide";
    } else {
      return "ng-show";
    }
  }

});
