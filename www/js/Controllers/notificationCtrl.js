app.controller('notificationsCtrl', ['$scope', '$stateParams', 'userService', '$ionicModal',
    function ($scope, $stateParams, userService, $ionicModal) {

        $scope.notifications = [];
        $scope.modal = {};
        $scope.selectedItem = {};

        $scope._init = function () {

            $ionicModal.fromTemplateUrl('templates/Modals/notificationModal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            userService.getNotifications()
                .then((_) => {
                    $scope.notifications = _;
                });
        }

        $scope.itemClick = function (it) {
            $scope.selectedItem = it;
            $scope.modal.show();
            userService.updateNotificationReaded(it);
        }
    }
]);