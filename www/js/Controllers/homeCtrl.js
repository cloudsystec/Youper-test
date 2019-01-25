app.controller('homeCtrl', ['$scope', '$stateParams', '$state', '$cordovaImagePicker', 'userService', '$q', '$cordovaFile',
    function ($scope, $stateParams, $state, $cordovaImagePicker, userService, $q, $cordovaFile) {

        var options = {
            maximumImagesCount: 1,
        }; 
  
        $scope.userData = {
            avatarUrl: "img/profile_placeholder.png",
        };

        $scope.notifications = [];

        $scope._init = function () {
            userService.getProfilePhoto()
                .then((_) => {
                    $scope.userData.avatarUrl = _;
                });

            userService.getNotifications()
            .then((_) => {
                $scope.notifications = _;
            });
        }

        $scope.hasNewNotifications = function () {
            var lst = $scope.notifications.filter(function (noty) {
                return !!noty.isNew;
            });

            return lst.length > 0;
        }

        $scope.goToNotifications = function () {
            $state.go('notifications');
        }

        $scope.changeProfileImage = function () {
            $scope.permissionCheck()
                .then(function (_) {
                    $cordovaImagePicker.getPictures(options)
                        .then(function (results) {

                            // $scope.userData.avatarUrl = results[0];
                            var fileName = results[0].replace(/^.*[\\\/]/, '');

                            $cordovaFile.readAsDataURL(cordova.file.cacheDirectory, fileName)
                                .then(function (success) {
                                    $scope.userData.avatarUrl = success;
                                    userService.uploadProfilePhoto(success);
                                });
                        }, function (error) {
                            // error getting photos
                        });
                });
        }

        $scope.permissionCheck = function () {
            var deferred = $q.defer();

            function error() {
                console.warn('READ_EXTERNAL_STORAGE permission is not turned on');
                deferred.reject();
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                    return;
                }
                deferred.resolve();
            }

            var permissions = cordova.plugins.permissions;
            permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
                if (status.hasPermission) {
                    success(status);
                }
                else {
                    permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);
                }
            });

            return deferred.promise;
        }
    }
])