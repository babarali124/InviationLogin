angular.module('AngularJSLogin', [])
    .controller('AngularLoginController', function ($scope, $http) {
        this.loginForm = function () {
            var user_data = 'email=' + this.inputData.email + '&password=' + this.inputData.password;
            $http({
                method: "POST",
                url: "services/login.php",
                data: user_data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).then(function mySuccess(response) {
                console.log(response.data);
                if (response.data.status === 'success') {
                    localStorage.setItem('invitation_login', true)
                    localStorage.setItem('invitation_user', response.data.id);
                    window.location.href = 'index.html';
                } else {
                    $scope.errorMsg = "Invalid Email and Password";
                }
            }, function myError(response) {
                console.log('Error Handle');
            });
        }
    });

$('input').blur(function () {
    var $this = $(this);
    if ($this.val())
        $this.addClass('used');
    else
        $this.removeClass('used');
});

var $ripples = $('.ripples');

$ripples.on('click.Ripples', function (e) {

    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find('.ripplesCircle');

    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;

    $circle.css({
        top: y + 'px',
        left: x + 'px'
    });

    $this.addClass('is-active');

});

$ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
    $(this).removeClass('is-active');
});