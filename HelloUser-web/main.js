(() => {
    "use strict";
    const socket = new WebSocket('ws://127.0.0.1:3337/streamlabs');

    const box = document.getElementById("msg-box");
    box.style.display = 'none';

    const queryDict = getParams();
    if (!('api_key' in queryDict)) {
        box.style.display = 'block';
        box.innerText = "api_key parameter required!"
        return
    }
    const API_KEY = queryDict.api_key;

    socket.onopen = () => {
        // Format your Authentication Information
        var auth = {
            author: "HelloUser",
            //website: "https://StreamlabsChatbot.com",
            api_key: API_KEY,
            events: ["EVENT_HELLO_USER"]
        };

        // Send your Data to the server
        socket.send(JSON.stringify(auth));
    };

    socket.onerror = (error) => {
        // Something went terribly wrong... Respond?!
        console.log("Error: " + error);
    };

    socket.onmessage = (message) => {
        // You have received new data now process it
        let msg_data = JSON.parse(message.data);
        if (msg_data.event == 'EVENT_HELLO_USER') {
            let msg = JSON.parse(msg_data.data).msg;
            console.log(msg);
            box.innerText = msg;
            box.style.display = 'block';
            setTimeout(() => {
                box.style.display = "none";
            }, 10000);
        }
    };

    socket.onclose = () => {
        // Connection has been closed by you or the server
        console.log("Connection Closed!");
    };

    function getParams() {
        let queryDict = {};
        location.search.substr(1).split("&").forEach((item) => {
            queryDict[item.split("=")[0]] = item.split("=")[1]
        });
        return queryDict;
    }
})();
