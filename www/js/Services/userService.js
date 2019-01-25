var service = angular.module('app.services', []);

service.factory('userService', ['$firebaseArray', '$q', '$firebaseObject', userService]);

function userService($firebaseArray, $q, $firebaseObject) {
    var N = {
        userPhoto: "userPhoto"
    };

    var imagesRef = fb.child('images');
    var notificationsRef = fb.child('notifications');

    return {
        getNotifications: getNotifications,
        uploadProfilePhoto: uploadProfilePhoto,
        getProfilePhoto: getProfilePhoto,
        updateNotificationReaded: updateNotificationReaded,
    }

    function updateNotificationReaded(noty) {
        var df = $q.defer();

        var nt = $firebaseObject(notificationsRef.child(noty.$id));
        noty.isNew = false;
        nt = angular.extend(nt, noty);
        nt.$save().then((_) => {
            df.resolve();
        });

        //dummy add for tests
        // $firebaseArray(notificationsRef).$add(nt);

        return df.promise;
    }

    function getNotifications(getAll = false) {
        var df = $q.defer();
        var query = !!getAll ? notificationsRef.limitToLast(1) : notificationsRef;

        $firebaseArray(query).$loaded().then((notificationList) => {
            df.resolve(notificationList.filter(function (noty) {
                return true;
            }).reverse());
        });

        return df.promise;
    }

    function uploadProfilePhoto(image) {

        window.localStorage.setItem(N.userPhoto, image);
        $firebaseArray(imagesRef).$add({ image: image });
    }

    function getProfilePhoto() {
        var df = $q.defer();

        var cachedPhoto = window.localStorage.getItem(N.userPhoto);
        if (!!cachedPhoto) {
            df.resolve(cachedPhoto);
            return df.promise;
        }

        $firebaseArray(imagesRef.limitToLast(1)).$loaded().then((_) => {
            var img = "";
            if (_.length > 0)
                img = _[_.length - 1].image;

            window.localStorage.setItem(N.userPhoto, img);
            df.resolve(img);
        });

        return df.promise;
    }
}