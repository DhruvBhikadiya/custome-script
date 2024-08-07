document.addEventListener('DOMContentLoaded', () => {
    <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>

    const socket = io(`http://127.0.0.1:8070`);

    socket.on('connect', () => {
        console.log('user connected :- ', socket.id);

        socket.emit('userConnected', socket.id);
    });
});