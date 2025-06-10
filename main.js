$(document).ready(() => {
    const questions = [
        {
            question: "Which is the largest animal in the world?",
            answers: [
                { text: "Shark", correct: false},
                { text: "Blue whale", correct: true},
                { text: "Elephant", correct: false},
                { text: "Giraffe", correct: false},
            ]
        },
            {
            question: "Which is the largest desert in the world?",
            answers: [
                { text: "Kalahari", correct: false},
                { text: "Gobi", correct: false},
                { text: "Sahara", correct: false},
                { text: "Antarctica", correct: true},
            ]
        },
            {
            question: "Which is the smallest continent in the world?",
            answers: [
                { text: "Asia", correct: false},
                { text: "Australia", correct: true},
                { text: "Arctic", correct: false},
                { text: "Africa", correct: false},
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const $questionElement = $("#question");
    const $answerButtons = $("#answer-buttons");
    const $nextButton = $("#next-btn");

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        $nextButton.html("Next");
        showQuestion();
    };

    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        let questionNumber = currentQuestionIndex + 1;
        $questionElement.text(`${questionNumber}. ${currentQuestion.question}`);
        currentQuestion.answers.forEach(answer => {
            const $button = $("<button></button>")
                .text(answer.text)
                .addClass("btn")
                .data("correct", answer.correct);
            $button.on("click", function () {
                selectAnswer($(this))
            });
            $answerButtons.append($button);
        });
    };

    function resetState() {
        $nextButton.hide();
        $answerButtons.empty();
    };

    function selectAnswer($selectedBtn) {
        const isCorrect = $selectedBtn.data("correct");
        if(isCorrect){
            $selectedBtn.addClass("correct");
            score++;
        } else {
            $selectedBtn.addClass("incorrect");
        };
        $answerButtons.children().each(function () {
            const $button = $(this);
            if($button.data("correct") === true) {
                $button.addClass("correct");
            }
            $button.attr("disabled","true");
        });
        $nextButton.css("display", "block");
    };

    function showScore() {
        resetState();
        $questionElement.html(`You scored ${score} out of ${questions.length}!`);
        $nextButton.htm("Play Again");
        $nextButton.css("display", "block");
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    $nextButton.on("click", () => {
        if(currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            startQuiz();
        }
    })

    startQuiz();
});
