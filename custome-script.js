// ------ load external script ---------------- start
var ioscript = document.createElement('script');
ioscript.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.js";
ioscript.async = true;
ioscript.async = true;
document.head.appendChild(ioscript);
ioscript.setAttribute('integrity','sha512-8BHxHDLsOHx+flIrQ0DrZcea7MkHqRU5GbTHmbdzMRnAaoCIkZ97PqZcXJkKZckMMhqfoeaJE+DNUVuyoQsO3Q==');
ioscript.setAttribute('crossorigin','anonymous');
ioscript.setAttribute('referrerpolicy','no-referrer');

// ------ load external script ---------------- start
var htmlcanvasscript = document.createElement('script');
htmlcanvasscript.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
htmlcanvasscript.async = true;
htmlcanvasscript.async = true;
document.head.appendChild(htmlcanvasscript);
htmlcanvasscript.setAttribute('integrity','sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==');
htmlcanvasscript.setAttribute('crossorigin','anonymous');
htmlcanvasscript.setAttribute('referrerpolicy','no-referrer');

const socket = io('https://51b5-103-251-16-214.ngrok-free.app');

let currentuserName;

let publicVapidKey = 'BFVA5gXzIz-p2poU4ltPxWYVkMwCJgDRW83uVFGb0huBSH6kp3g7s0zW_IYSHlyJM32gIGCo9FjtQLhgwNzYOOk';
const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

const scriptElement = document.querySelector('script[src="https://scoreconnect.s3.us-east-1.amazonaws.com/widget/crm-client-script.js"]');

let partnerKey;
if (scriptElement.getAttribute('partnerKey')) {
    partnerKey = scriptElement.getAttribute('partnerKey');
}
let globalSocketId;

const binaryEvent = (event) => {
    return event.split('').map(char => {
        const asciiValue = char.charCodeAt(0);

        const binaryValue = asciiValue.toString(2);

        return binaryValue.padStart(8, '0');
    }).join(' ');
};

function binaryToString(binary) {
    return binary.split(' ')
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('');
};


function stringToBinary(str) {
    return str.split('')
        .map(char => {
            const binary = char.charCodeAt(0).toString(2);
            return binary.padStart(8, '0');
        })
        .join(' ');
};

var peer = new Peer();

let peerId;

function loadNotification() {
    const body = document.body;

    const notificationDiv = document.createElement('div');
    notificationDiv.id = 'notificationDiv';
    notificationDiv.style.position = 'fixed';
    notificationDiv.style.display = 'none';
    notificationDiv.style.zIndex = '99999999999';
    notificationDiv.style.width = 'max-content';
    notificationDiv.style.minWidth = '250px';
    notificationDiv.style.maxWidth = '400px';
    notificationDiv.style.fontFamily = 'sans-serif';
    notificationDiv.style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px';
    notificationDiv.style.borderRadius = '15px';
    notificationDiv.style.borderBottom = '5px solid #1e3a8a';
    notificationDiv.style.backgroundColor = '#fff';
    notificationDiv.style.transition = 'all 0.3s';
    notificationDiv.onmouseenter = () => {
        notificationDiv.style.boxShadow = 'rgb(0 0 0 / 34%) 0px 5px 15px 0px';
    };
    notificationDiv.onmouseleave = () => {
        notificationDiv.style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px';
    };

    const notificationHeader = document.createElement('div');
    notificationHeader.id = 'notificationHeader';
    notificationHeader.style.padding = '10px 15px';
    notificationHeader.style.display = 'flex';
    notificationHeader.style.alignItems = 'center';
    notificationHeader.style.borderBottom = '2px solid #ed6a1d';
    notificationHeader.style.justifyContent = 'space-between';

    const notificationTitle = document.createElement('div');
    notificationTitle.id = 'notificationTitle';
    notificationTitle.style.fontWeight = '700';
    notificationTitle.style.fontSize = '16px';
    notificationTitle.textContent = '';

    const notificationClose = document.createElement('div');
    notificationClose.id = 'notificationClose';
    notificationClose.style.height = '25px';
    notificationClose.style.width = '25px';
    notificationClose.style.fontSize = '12px';
    notificationClose.style.display = 'flex';
    notificationClose.style.alignItems = 'center';
    notificationClose.style.justifyContent = 'center';
    notificationClose.style.borderRadius = '7px';
    notificationClose.style.backgroundColor = '#ed6a1d';
    notificationClose.style.color = '#fff';
    notificationClose.style.cursor = 'pointer';
    notificationClose.style.textTransform = 'uppercase';
    notificationClose.style.fontWeight = '800';
    notificationClose.textContent = 'X';
    notificationClose.onclick = () => {
        notificationDiv.style.display = 'none';
    };

    notificationHeader.appendChild(notificationTitle);
    notificationHeader.appendChild(notificationClose);

    const notificationBody = document.createElement('div');
    notificationBody.style.padding = '10px 15px';

    const notificationDesc = document.createElement('div');
    notificationDesc.id = 'notificationDesc';
    notificationDesc.style.fontSize = '14px';
    notificationDesc.style.lineHeight = '22px';
    notificationDesc.textContent = '';

    notificationBody.appendChild(notificationDesc);

    notificationDiv.appendChild(notificationHeader);
    notificationDiv.appendChild(notificationBody);

    body.appendChild(notificationDiv);
}

loadNotification();

// NOTIFICATION START
const sendNotification = binaryEvent('sendNotification');
socket.on(sendNotification, (data) => {
    try {

        const jsonString = binaryToString(data);

        const parsedData = JSON.parse(jsonString);

        const { id, title, message, position } = parsedData;

        let notification = document.getElementById('notificationDiv');
        let notificationTitle = document.getElementById('notificationTitle');
        let notificationMessage = document.getElementById('notificationDesc');
        let notificatioClose = document.getElementById('notificationClose');

        notification.style.display = 'block';

        notificationTitle.innerText = title;
        notificationMessage.innerText = message;

        notification.style.top = '';
        notification.style.right = '';
        notification.style.bottom = '';
        notification.style.left = '';
        notification.style.transform = '';

        if (position === 'topRight') {
            notification.style.right = '15px';
            notification.style.top = '15px';
        }
        else if (position === 'topCenter') {
            notification.style.right = '50%';
            notification.style.left = '50%';
            notification.style.top = '15px';
            notification.style.transform = 'translate(-50%)';
        }
        else if (position === 'middleRight') {
            notification.style.top = '50%';
            notification.style.right = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else if (position === 'middleCenter') {
            notification.style.top = '50%';
            notification.style.right = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
        }
        else if (position === 'middleLeft') {
            notification.style.top = '50%';
            notification.style.left = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else if (position === 'bottomRight') {
            notification.style.bottom = '15px';
            notification.style.right = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else if (position === 'bottomCenter') {
            notification.style.bottom = '15px';
            notification.style.right = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
        }
        else if (position === 'bottomLeft') {
            notification.style.bottom = '15px';
            notification.style.left = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else {
            notification.style.left = '15px';
        }

        notificatioClose.addEventListener('click', () => {
            notification.style.display = 'none'
        });
    }
    catch (e) {
        console.log(e, "error");
    }
});
// NOTIFICATION END

function addWindowFunction() {
    window.joinUserToCRM = (userId, partnerKey) => {
        const data = {
            userId: userId,
            socketId: globalSocketId,
            partnerKey: partnerKey
        };


        const jsonString = JSON.stringify(data);
        const binaryCode = stringToBinary(jsonString);
        const userJoined = binaryEvent('userJoined');
        socket.emit(userJoined, (binaryCode));
        loadPushNotification();
    }
}

function tempJoin() {
    let nameField = document.getElementById('nameField');
    let loginpage = document.getElementById('loginpage');
    let tipspage = document.getElementById('tipspage');
    if (nameField) {
        if (nameField.value.length > 0) {
            currentuserName = nameField.value;
            window.joinUserToCRM(nameField.value, partnerKey);
            if (loginpage && tipspage) {
                loginpage.style.display = "none";
                tipspage.style.display = "block";
            }
        }
    }
}

socket.on('connect', async () => {

    console.log('A new user connected :- ', socket.id);
    globalSocketId = socket.id;

    addWindowFunction();

    const userClicked = binaryEvent('userClicked');
    socket.on(userClicked, async () => {
        try {

            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            await new Promise((resolve) => (video.onloadedmetadata = resolve));

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            stream.getTracks().forEach(track => track.stop());

            const blob = await new Promise((resolve, reject) => {
                captureCanvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create Blob from canvas'));
                    }
                }, 'image/png');
            });

            const arrayBuffer = await blob.arrayBuffer();

            const chunkSize = 976 * 1024;
            const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
                const chunk = arrayBuffer.slice(start, end);

                const sentDataChunk = binaryEvent('sentDataChunk');

                const indexString = JSON.stringify(i);
                const totalChunksString = JSON.stringify(totalChunks);

                const index = stringToBinary(indexString);
                const totalChunk = stringToBinary(totalChunksString);

                const partnerId = stringToBinary(partnerKey);

                socket.emit(sentDataChunk, chunk, index, totalChunk, partnerId);
            };
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

peer.on('open', (id) => {
    console.log('Peer connection open with ID :- ', id)
    peerId = id;
});

const start_screen_share = binaryEvent('start_screen_share');
socket.on(start_screen_share, async (data) => {
    const { peerId, userId } = JSON.parse(binaryToString(data));
    console.log('start_screen_share ------------------');
    try {
        let stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const call = peer.call(peerId, stream);

        stream.getVideoTracks()[0].onended = () => {
            const stoppedScreenSharing = binaryEvent('stoppedScreenSharing');
            const stopedData = stringToBinary({ partnerKey, userId });
            socket.emit(stoppedScreenSharing, stopedData);
        };
    }
    catch (e) {
        console.log('Error accessing screen share', e);
        const partnerId = stringToBinary(partnerKey);
        const deniedScreenSharing = binaryEvent('deniedScreenSharing');
        socket.emit(deniedScreenSharing, partnerId);
    }
});

function loadPushNotification() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                if (permission === 'granted') {
                    send().catch(err => {
                        console.error(err)
                    });
                }
            } else if (permission === 'denied') {
                console.log('Notification permission denied.');
            }
        });
    } else if (Notification.permission === 'denied') {
        Notification.requestPermission().then(permission => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                    send().catch(err => {
                        console.error(err)
                    });
                }
            } else if (permission === 'denied') {
                console.log('Notification permission denied.');
            }
        });
    } else if (Notification.permission === "granted") {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            send().catch(err => {
                console.error(err)
            });
        }
    }
}
// });

function getNotifyUsers() {
    let NotifyUsers = new Set;
    let usersList = document.querySelectorAll('li');
    usersList.forEach(x => {
        if (x.childNodes[1].childNodes[1].checked) {
            NotifyUsers.add(x.id);
        }
    });
    return Array.from(NotifyUsers);
}

// Register SW, Register Push, Send Push
async function send() {

    console.log("Registering service worker...");
    console.log("=---=-=->,", navigator.serviceWorker);
    const register = await navigator.serviceWorker.register("./service-worker.js", {
        scope: "/"
    });
    console.log("Service Worker Registered...");

    // Register Push
    let subscription = await register.pushManager.getSubscription();
    if (!subscription) {
        console.log("register.pushManager.subscribe...");
        subscription = await register.pushManager.subscribe({
            applicationServerKey,
            userVisibleOnly: true
        });
        console.log("Create new subsciption...");
    } else {
        console.log("Exist Suscription : \n", subscription);
    }
    const sendUserSubscription = binaryEvent('sendUserSubscription');
    const userName = stringToBinary(currentuserName);
    console.log(partnerKey);
    const partnerkey = stringToBinary(partnerKey);
    const endpoint = stringToBinary(JSON.stringify(subscription.endpoint));
    const expirationTime = stringToBinary(JSON.stringify(subscription.expirationTime));
    console.log(subscription);
    socket.emit(sendUserSubscription, partnerkey, userName, endpoint, expirationTime, subscription);
}

// Check for service worker
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};
