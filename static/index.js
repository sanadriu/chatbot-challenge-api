fetch("http://localhost:4000")
	.then((response) => response.text())
	.then((data) => console.log(data))
	.catch((error) => console.log(error));

const eventSource = new EventSource("http://localhost:4000/chats/623f6b290c7c6656daea7d13/subscribe", {});

eventSource.onopen = function () {
	console.log("connection to stream has been opened");
};
eventSource.onerror = function (error) {
	console.log("An error has occurred while receiving stream", error);
	eventSource.close();
};
eventSource.onmessage = function (stream) {
	console.log("received stream", stream);
};

setTimeout(() => {
	eventSource.close();
}, 10000);
