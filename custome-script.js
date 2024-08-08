document.addEventListener('DOMContentLoaded', () => {

    const socket = io(`http://127.0.0.1:8070`);

    const currentuserId = document.getElementById('currentUserId').value;
    const currentuserName = document.getElementById('currentUserName').value;
    const logout = document.getElementById('logout');
    var ipAdd;

    socket.on('connect', async () => {
        console.log('user connected :- ', socket.id);

        const socketId = socket.id;

        const raw = await fetch('https://api.ipify.org?format=json');
        const rawData = await raw.json();
        ipAdd = rawData.ip;

        const battery = await navigator.getBattery();
        const batteryCharging = battery.charging ? true : false;

        const deviceInfo = {
            userAgent: navigator.userAgent,
            connectionType: navigator.connection.effectiveType,
            deviceMemory: navigator.deviceMemory,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            colorDepth: screen.colorDepth,
            downlink: navigator.connection.downlink,
            batteryLevel: battery.level,
            batteryCharging: batteryCharging
        };

        const data = {
            userName: currentuserName,
            userId: currentuserId,
            socketId: socketId,
            deviceInfo: deviceInfo
        };

        socket.emit('userJoined', (data));

        logout.addEventListener('click', (e) => {
            socket.emit('userLogout', (data));
        });

        socket.on('userClicked', async () => {
            try {

                const captureCanvas = await html2canvas(document.body, {
                    scrollX: window.scrollX,
                    scrollY: 0,
                    x: window.scrollX,
                    y: window.scrollY,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    useCORS: true,
                    scale: window.devicePixelRatio
                });

                console.log('Canvas created successfully:', captureCanvas);

                const blob = await new Promise((resolve, reject) => {
                    captureCanvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to create Blob from canvas'));
                        }
                    }, 'image/png');
                });

                console.log('Blob created successfully:', blob);

                const arrayBuffer = await blob.arrayBuffer();
                console.log('ArrayBuffer created successfully:', arrayBuffer);

                const chunkSize = 25 * 1024;
                const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

                console.log(totalChunks, '--totalChunks--');

                for (let i = 0; i < totalChunks; i++) {
                    const start = i * chunkSize;
                    const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
                    const chunk = arrayBuffer.slice(start, end);
                    console.log(chunk, '--chunk--');

                    socket.emit('sentDataChunk', {
                        chunk,
                        index: i,
                        totalChunks: totalChunks
                    });
                };
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});
