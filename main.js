$(document).ready(() => {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let levels = ["easy", "medium", "hard"];

    const $questionElement = $("#question");
    const $answerButtons = $("#answer-buttons");
    const $nextButton = $("#next-btn");
    const $quizDiv = $(".quiz");
    const $selectLevel = $(".select-level");

    levels.forEach(level => {
        const $levelButton = $("<button></button>")
            // Capitalise first letter of level text
            .text(level.charAt(0).toUpperCase() + level.slice(1))
            .addClass("level-btn btn")
        $levelButton.on("click", () => startQuiz(level))
        $selectLevel.append($levelButton);
    })

    function startQuiz(level) {
        $selectLevel.hide();
        $quizDiv.show();
        currentQuestionIndex = 0;
        score = 0;
        $nextButton.html("Next");
        fetchQuestions(level);
    };

    function fetchQuestions(level) {
        fetch("https://the-trivia-api.com/v2/questions?" + new URLSearchParams({
            limit: "10",
            difficulties: level
        }))
        .then(response => {
            return response.json()
        })
        .then(data => {
            questions = data;
            showQuestion();
        })
        .catch(error => {
            console.log(error);
        })
    }

    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        let questionNumber = currentQuestionIndex + 1;
        $questionElement.text(`${questionNumber}. ${currentQuestion.question.text}`);
        currentQuestion.incorrectAnswers.forEach(incorrectAnswer => {
            const $button = $("<button></button>")
                .text(incorrectAnswer)
                .addClass("btn")
                .data("correct", false);
            $button.on("click", function() {
                selectAnswer($(this))
            });
            $answerButtons.append($button);
        });
        const $button = $("<button></button>")
            .text(currentQuestion.correctAnswer)
            .addClass("btn")
            .data("correct", true);
        $button.on("click", function() {
            selectAnswer($(this))
        });
        $answerButtons.append($button);
        // Shuffle answer buttons
        $answerButtons.children().sort(function() {
            return Math.random() - 0.5;
        }).detach().appendTo($answerButtons);
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
        $nextButton.html("Play Again");
        $nextButton.css("display", "block");
    };

    function handleNextButton() {
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    };

    function showSelectLevel() {
        $quizDiv.hide();
        $selectLevel.css("display", "block");
    };

    $nextButton.on("click", () => {
        if(currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            showSelectLevel();
        }
    });
});
