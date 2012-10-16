/*$(document).ready(function() {
  $.ajax({
    url: '/users/connected/',
    async: true,
    success: function(data) {
      var select = $('#users').get(0);
      data.usersConnected.forEach(function(element) {
        select.options[select.options.length] = new Option(element, element);
      });
    }
  })
  
  $('#challenge').click(function() {
    var selectedUser = $('#users option:selected').get(0).value;
    
    alert(selectedUser);
  });
});*/
