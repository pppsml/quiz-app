// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyALM5TDwXkgRlt-fLP0fjVSqdtJQJH4moQ",
	authDomain: "quiz-app-e7804.firebaseapp.com",
	databaseURL: "https://quiz-app-e7804-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "quiz-app-e7804",
	storageBucket: "quiz-app-e7804.appspot.com",
	messagingSenderId: "739781661529",
	appId: "1:739781661529:web:22a56508ca35bdaf6b3248"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const _quizzes = firestore.collection('QuizData')


// data converter from class to object
const quizConverter = {
	toFirestore: function({name, id, likes, quiz}) {
		return {
			name: name,
			id: id,
			likes: likes,
			quiz: quiz,
		};
	},
	fromFirestore: function(snapshot, options) {
		const data = snapshot.data(options);
		return new QuizData(data);
	},
};

// get data from firebase
_quizzes.get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        data.docData[doc.data().id] = new QuizData(doc.data())
        data.quizNames.push(doc.data().id)
		startScreen()
		loader.classList.add('dn')
    });
})
.catch((err) => {
	console.error(`An error occurred on the server: ${err}.
	Please try again later.`);
	alert(`An error occurred on the server.
	Please try again later.`);
});