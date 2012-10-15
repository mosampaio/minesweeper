minesweeper
===========

minesweeper

<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect(window.location.origin);
  socket.on('news', function (data) {
    alert(data);
    socket.emit('my other event', { my: 'data' });
  });
</script>