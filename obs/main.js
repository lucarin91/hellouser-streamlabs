(() => {
    "use strict";
    const socket = new WebSocket('ws://localhost:3337/streamlabs');

    const box = document.getElementById("msg-box");
    box.style.display = 'none';

    const queryDict = getParams();
    if (!('api_key' in queryDict)) {
        box.style.display = 'block';
        box.innerText = "api_key parameter required!"
        return
    }
    const API_KEY = queryDict.api_key;
    const SHOW_TIME = 10

    // global varibles
    let time, updateFun;

    socket.onopen = () => {
        // Format your Authentication Information
        var auth = {
            author: "lucarin91",
            website: "https://github.com/lucarin91/hellouser-streamlabs",
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
            showBox(msg);
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

    function showBox(msg) {
        box.innerText = msg;
        box.style.display = 'block';
        time = SHOW_TIME;
        if (!updateFun) {
            runInterval();
        }
    }

    function runInterval() {
        updateFun = setInterval(() => {
            if (time == 0) {
                box.style.display = "none";
                clearInterval(updateFun)
                updateFun = null
                console.log('clear interval')
            } else {
                time--
                console.log('interval', time)
            }
        }, 1000)
    }
})();