fetch("http://localhost:4000")
	.then((response) => response.text())
	.then((data) => console.log(data))
	.catch((error) => console.log(error));

const eventSource = new EventSource("http://localhost:4000/chats/624054480c7c6656daea7d14/subscribe?phone=666666665");

eventSource.onopen = function () {
	console.log("connection to stream has been opened");
};
eventSource.onerror = function (error) {
	console.log("An error has occurred while receiving stream", error);
	eventSource.close();
};
eventSource.onmessage = function (stream) {
	console.log("received stream", console.log(JSON.parse(stream.data)));
};

// setTimeout(() => {
// 	eventSource.close();
// }, 10000);
