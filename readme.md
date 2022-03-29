# Chatbot challenge

This API is a chatbot that asks the user various types of questions defined by the bussines that created the corresponding chat configuration. The user is expected to answer depending on the type of the question asked. If the user writes somewthing unexpected to process, the chatbot is responsible of telling the users to correct their previous answer. Chatbot will only save the first reply to a question, and will ignore all the next ones for the same question until the chatbot doesn't ask them again.

## What has been used?

---

The main requirements of this project were the use of **Express.js** and **Typescript**. For data persistance it has been used **MongoDB** and **Mongoose**, and for request validation it has been used **Yup**.

## How has the code been structured?

---

In this project it has been created OOP to create classes for _controllers_, _services_, _repositories_ and _models_. Interfaces has been used to allow that some classes do not depend directly on some other classes, but they rely on the interfaces that are implemented.

- **App** class relies on an array of _IController_ interfaces, and on _IDatabaseService_ interface.
- **ChatController** class implements the _IController_ interface and relies on _IChatService_ interface.
- **DatabaseService** class implements the _IDatabaseService_ interface and interacts with **Mongoose** methods to handle database connection.
- **ChatService** class implements the _IChatService_ interface and relies on _IChatRepository_ interface, but directly on the **ChatResults** class.
- **ChatRepository** class implements the _IChatRepository_ interface and depends on the **ChatModel** class created with _Mongoose_

These classes are not instantiated inside other classes, but are instantiated outside their scope and injected to them, by passing the instance to constructor functions (Inversion of control).

There have been used 3 middlewares:

- **SSE middleware**: Sets the response headers ready to sent Server-Sent Events to the client.

- **Error middleware**: It handles errors thrown by other middlewares or controller methods.

- **Validation middleware**: It's a middleware factory that receives a _Yup_ schema to validate it against the _body_, _query_ or _params_ of the request. If the validation in this middleware fails, a _Bad Request_ error is thrown.

## Environment preparation

---

Once you have cloned the repository, you will have to download all the dependencies by running `npm install`

In order to run this application, is required to have a MongoDB server and create a database that will store data for the collections of _Client_ and _Chat_. The API uses the mongo _URI_ to achieve the connection, so that you will have to specify it in the **.env** file.

You will have to create a .env file with the next environment variables. You can modify their values to fit your needs:

```
PORT=4000
POLLING_TIME=10000
MONGO_PATH_DEV=localhost:27017/chatbot
```

In MongoDB, we will create the **chatbot** database, with a collection named **chats**.

In the **chats** collection we will manually create the next sample chat configuration:

```
[
	{
		"name": "demo",
		"sequence": [
			{
				"name": "username",
				"datatype": "text",
				"msgTemplate": "Hello! What’s your name?",
				"errTemplate": "Sorry. I couldn't understand your name. Could you repeat it again?"
			},
			{
				"name": "birthdate",
				"datatype": "date",
				"msgTemplate": "Hi, {{username}}! What’s your birthdate?",
				"errTemplate": "Ohh, apologies {{username}}, I don’t understand. \n\nCan you please specify your birthdate in YYYY-MM-DD format? \n\nThanks!"
			},
			{
				"name": "plan",
				"datatype": "option",
				"options": ["A", "B", "C"],
				"msgTemplate": "Nice! What insurance plan are you interested in?\n\nA: Basic health insurance.\nB: Full health insurance.\nC: Full health and dental insurance.\n\nPlease answer A, B or C according to your choice.",
				"errTemplate": "Sorry, can you please reply A, B or C depending on what insurance plan you wish to purchase? Thanks."
			}
		]
	}
]

```

The **ObjectID** of this chat will be used later when we had to make requests to the API.

In order to run the API in development mode, you will have to run `npm run dev`
