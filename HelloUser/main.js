(() => {
    "use strict";

    const box = document.getElementById("msg-box");
    box.style.display = 'none';

    // Load configuration
    if (!settings.api_key || !settings.show_time){
        box.style.display = 'block';
        box.innerText = "api_key should be setted!"
        return
    }
    console.log(settings);    

    function tryConnect(){
        connect((err) => {
            if (err) {
                tryConnect();
            }
        });
    }
    tryConnect();
    
    function connect (cb) {
        const socket = new WebSocket('ws://localhost:3337/streamlabs');
        
        socket.onopen = () => {
            // Format your Authentication Information
            var auth = {
                author: "lucarin91",
                website: "https://github.com/lucarin91/hellouser-streamlabs",
                api_key: settings.api_key,
                events: ["EVENT_HELLO_USER"]
            };

            console.log('send auth', auth);
            // Send your Data to the server
            socket.send(JSON.stringify(auth));
        };

        socket.onerror = (error) => {
            // Something went terribly wrong... Respond?!
            console.log("Error: " + error);
            cb('error');
        };

        socket.onmessage = (message) => {
            // You have received new data now process it
            let msg_data = JSON.parse(message.data);
            if (msg_data.event == 'EVENT_HELLO_USER') {
                let msg = JSON.parse(msg_data.data).msg;
                greet(msg);
            }else if (msg_data.event == "EVENT_CONNECTED") {
                console.log("Connected!");
            } else {
                console.log('Other message', msg_data);
            }
        };

        socket.onclose = () => {
            // Connection has been closed by you or the server
            console.log("Connection Closed!");
            cb('close');
        };
    }

    let greetings = [], time = 0, updateFun;

    function greet(msg){
        console.log('Add greeting in queue');
        greetings.push(msg);

        // if the service is already run just exit
        if (updateFun) return;
    
        // else start the services
        let showGreeting = () => {
            console.log('Show new greetings in queue', greetings);
            time = settings.show_time;
            let msg = greetings.splice(0, 1)[0];            
            showBox(msg);
        };
        showGreeting();

        updateFun = setInterval(() => {
            if (time == 0) {
                if (greetings.length != 0){
                    showGreeting();
                } else {
                    console.log('No more greetings')
                    hideBox();
                    clearInterval(updateFun);
                    updateFun = undefined;
                }
            } else {
                time--;
                console.log('interval', time);
            }
        }, 1000);
    }

    function showBox(msg) {
        box.innerText = msg;
        box.style.display = 'block';
    }

    function hideBox(){
        box.style.display = "none";
    }
})();