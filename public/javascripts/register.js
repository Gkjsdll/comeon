'use strict';

var $email, $password, $password2;

$(function() {
  $email = $('#email');
  $password = $('#password');
  $password2 = $('#password2');
  // $('.regli, .logoutli').css('visibility', 'hidden');
  $('form').on('submit', registerUser);
});

function registerUser(e) {
  e.preventDefault();

  var email = $email.val();
  var password = $password.val();
  var password2 = $password2.val();

  if(password !== password2) {
    $('.password').val('');
    return alert('Passwords must match.');
  }

  $.post('/users/register', {email: email, password: password})
  .success(function(data) {
    console.log('success!!!');
    console.log(data);
    location.href = '/';
  })
  .fail(function(err) {
    alert('Error.  Check console.');
    console.log('err:', err);
  });
}
