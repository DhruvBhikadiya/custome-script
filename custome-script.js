document.addEventListener('DOMContentLoaded', () => {
    const socket = io(`http://127.0.0.1:8070`);

    socket.on('connect', () => {
        console.log('user connected from custome-script :- ', socket.id);

        socket.emit('userConnect', socket.id);
    });
});
