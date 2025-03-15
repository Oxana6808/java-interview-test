// Глобальные переменные
let currentLanguage = localStorage.getItem('language') || 'ru';
let currentCategory = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let mistakes = new Set();
let mistakeHistory = new Set();
let selectedAnswer = null;

// Список категорий
const categories = [
    "Java Core",
    "Object-Oriented Programming (OOP)",
    "JVM, JDK, JRE",
    "JVM Memory Management & Garbage Collection",
    "Exceptions & Error Handling",
    "Collections",
    "Multithreading & Concurrency",
    "Input/Output Streams (IO/NIO)",
    "Java 8+ (Lambdas, Streams, Functional Interfaces)",
    "JDBC & Databases",
    "JPA & Hibernate (ORM)",
    "SQL & NoSQL Databases",
    "Design Patterns",
    "Spring Framework",
    "Apache Kafka",
    "REST API & Web Services",
    "Testing (JUnit, Mockito, TDD)",
    "Build Systems & Dependency Management (Maven, Gradle)",
    "Git & Version Control Systems",
    "Docker & Containerization",
    "Architecture & Application Design",
    "Algorithms & Data Structures",
    "All Questions"
];

// Маппинг категорий для перевода
const categoryTranslations = {
    "Java Core": { ru: "Java Core", en: "Java Core" },
    "Object-Oriented Programming (OOP)": { ru: "Объектно-ориентированное программирование (ООП)", en: "Object-Oriented Programming (OOP)" },
    "JVM, JDK, JRE": { ru: "JVM, JDK, JRE", en: "JVM, JDK, JRE" },
    "JVM Memory Management & Garbage Collection": { ru: "Память JVM и сборка мусора", en: "JVM Memory Management & Garbage Collection" },
    "Exceptions & Error Handling": { ru: "Исключения и обработка ошибок", en: "Exceptions & Error Handling" },
    "Collections": { ru: "Коллекции", en: "Collections" },
    "Multithreading & Concurrency": { ru: "Многопоточность и конкурентность", en: "Multithreading & Concurrency" },
    "Input/Output Streams (IO/NIO)": { ru: "Потоки ввода-вывода (IO/NIO)", en: "Input/Output Streams (IO/NIO)" },
    "Java 8+ (Lambdas, Streams, Functional Interfaces)": { ru: "Java 8+ (Lambdas, Streams, Functional Interfaces)", en: "Java 8+ (Lambdas, Streams, Functional Interfaces)" },
    "JDBC & Databases": { ru: "JDBC и базы данных", en: "JDBC & Databases" },
    "JPA & Hibernate (ORM)": { ru: "JPA и Hibernate (ORM)", en: "JPA & Hibernate (ORM)" },
    "SQL & NoSQL Databases": { ru: "SQL и NoSQL базы данных", en: "SQL & NoSQL Databases" },
    "Design Patterns": { ru: "Шаблоны проектирования", en: "Design Patterns" },
    "Spring Framework": { ru: "Spring Framework", en: "Spring Framework" },
    "Apache Kafka": { ru: "Apache Kafka", en: "Apache Kafka" },
    "REST API & Web Services": { ru: "REST API и веб-сервисы", en: "REST API & Web Services" },
    "Testing (JUnit, Mockito, TDD)": { ru: "Тестирование (JUnit, Mockito, TDD)", en: "Testing (JUnit, Mockito, TDD)" },
    "Build Systems & Dependency Management (Maven, Gradle)": { ru: "Системы сборки и управление зависимостями (Maven, Gradle)", en: "Build Systems & Dependency Management (Maven, Gradle)" },
    "Git & Version Control Systems": { ru: "Git и системы контроля версий", en: "Git & Version Control Systems" },
    "Docker & Containerization": { ru: "Docker и контейнеризация", en: "Docker & Containerization" },
    "Architecture & Application Design": { ru: "Архитектура и дизайн приложений", en: "Architecture & Application Design" },
    "Algorithms & Data Structures": { ru: "Алгоритмы и структуры данных", en: "Algorithms & Data Structures" },
    "All Questions": { ru: "Все вопросы", en: "All Questions" }
};

// Инициализация элементов DOM после загрузки страницы
window.onload = () => {
    const themeSelection = document.getElementById('theme-selection');
    const testContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result');
    const questionText = document.getElementById('question-text');
    const levelIndicator = document.getElementById('level-indicator');
    const optionsDiv = document.getElementById('options');
    const questionCounter = document.getElementById('question-counter');
    const stopBtn = document.getElementById('stop-btn');
    const nextOrDontKnowBtn = document.getElementById('next-or-dont-know-btn');
    const returnBtn = document.getElementById('return-btn');
    const resultBody = document.getElementById('result-body');
    const resultTitle = document.getElementById('result-title');
    const title = document.getElementById('title') || document.getElementById('quiz-header');
    const quizTitle = document.getElementById('quiz-title');
    const topicsTitle = document.getElementById('topics-title');
    const topicList = document.getElementById('topicList');

    // Проверка загрузки данных и отладка
    console.log("Checking questionsData:", questionsData);
    if (typeof questionsData === 'undefined' || !Array.isArray(questionsData) || questionsData.length === 0) {
        console.error("Ошибка: questionsData не загружен, пуст или не является массивом");
        if (topicList) {
            topicList.innerHTML = `<p>${currentLanguage === 'ru' ? 'Ошибка: Данные не загружены или пусты' : 'Error: Data not loaded or empty'}</p>`;
        }
        return;
    }
    console.log("Данные загружены:", questionsData);

    // Обработчик переключения языка
    function changeLanguage(lang) {
        if (currentLanguage !== lang) {
            currentLanguage = lang;
            localStorage.setItem('language', currentLanguage);
            updateLanguage();
        }
    }

    // Установка обработчиков для кнопок языка
    document.querySelectorAll('.language-buttons button').forEach(btn => {
        const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.addEventListener('click', () => changeLanguage(lang));
    });

    // Обновление текста на основе языка
    function updateLanguage() {
        updateLanguageButtons();
        updateTitle();
        updateButtonText();
        updateTableHeaders();
        if (testContainer && testContainer.style.display === 'block') {
            loadQuestion();
        }
        if (resultContainer && resultContainer.style.display === 'block') {
            showResults();
        }
        if (themeSelection && themeSelection.style.display !== 'none') {
            renderTopics();
        }
    }

    // Обновление активной кнопки языка
    function updateLanguageButtons() {
        document.querySelectorAll('.language-buttons button').forEach(btn => {
            const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            btn.classList.toggle('active', lang === currentLanguage);
        });
    }

    // Обновление текста заголовка
    function updateTitle() {
        const titles = {
            ru: 'Тест по собеседованию Java ☕',
            en: 'Java Interview Test ☕'
        };
        if (title) title.textContent = titles[currentLanguage];
        if (topicsTitle) topicsTitle.textContent = currentLanguage === 'ru' ? 'Список тем' : 'List of Topics';
        if (currentCategory && quizTitle) {
            const translatedCategory = categoryTranslations[currentCategory] ? categoryTranslations[currentCategory][currentLanguage] : currentCategory;
            quizTitle.textContent = currentLanguage === "ru" ? `Тест: ${translatedCategory}` : `Quiz: ${translatedCategory}`;
        }
        if (resultTitle && currentCategory) {
            const translatedCategory = categoryTranslations[currentCategory] ? categoryTranslations[currentCategory][currentLanguage] : currentCategory;
            resultTitle.textContent = currentLanguage === 'ru' ? `Результаты: ${translatedCategory}` : `Results: ${translatedCategory}`;
        }
    }

    // Обновление заголовков таблицы
    function updateTableHeaders() {
        const tableHeaders = document.querySelectorAll('#result-table th');
        if (tableHeaders.length > 0) {
            tableHeaders[0].textContent = currentLanguage === 'ru' ? 'Вопрос' : 'Question';
            tableHeaders[1].textContent = currentLanguage === 'ru' ? 'Правильный ответ' : 'Correct Answer';
        }
    }

    // Обновление текста кнопок
    function updateButtonText() {
        if (stopBtn) stopBtn.textContent = currentLanguage === 'ru' ? 'Стоп' : 'Stop';
        if (nextOrDontKnowBtn) {
            const currentQuestion = currentQuestions[currentQuestionIndex];
            const correctAnswerIndex = currentQuestion ? currentQuestion.shuffledCorrectAnswerIndex : null;
            if (selectedAnswer === null) {
                nextOrDontKnowBtn.textContent = currentLanguage === 'ru' ? 'Не знаю' : "Don't Know";
                nextOrDontKnowBtn.onclick = dontKnow;
            } else if (selectedAnswer === correctAnswerIndex) {
                nextOrDontKnowBtn.textContent = currentLanguage === 'ru' ? 'Далее' : 'Next';
                nextOrDontKnowBtn.onclick = nextQuestion;
            } else {
                nextOrDontKnowBtn.textContent = currentLanguage === 'ru' ? 'Не знаю' : "Don't Know";
                nextOrDontKnowBtn.onclick = dontKnow;
            }
        }
        if (returnBtn) returnBtn.textContent = currentLanguage === 'ru' ? 'Вернуться в начало' : 'Return to Start';
    }


    // Рендеринг тем
    function renderTopics() {
        console.log("Rendering topics...");
        if (!topicList) {
            console.error("Ошибка: Элемент topicList не найден в DOM");
            return;
        }
        topicList.innerHTML = '';

        // Подсчитываем количество вопросов для каждой категории
        const questionCounts = {};
        categories.forEach(category => {
            if (category === "All Questions") {
                questionCounts[category] = questionsData.length;
            } else {
                questionCounts[category] = questionsData.filter(q => q.category === category).length;
            }
        });

        const rows = Math.ceil(categories.length / 3);
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.classList.add('topic-row');
            for (let j = 0; j < 3; j++) {
                const index = i * 3 + j;
                if (index < categories.length) {
                    const button = document.createElement('button');
                    button.classList.add('theme-btn');
                    const numberSpan = document.createElement('span');
                    numberSpan.className = 'number';
                    numberSpan.textContent = `${index + 1}.`;
                    const categoryText = categoryTranslations[categories[index]][currentLanguage];
                    const count = questionCounts[categories[index]] || 0;
                    button.appendChild(numberSpan);
                    button.appendChild(document.createTextNode(` ${categoryText} (${count})`));
                    button.addEventListener('click', () => startQuiz(categories[index]));
                    row.appendChild(button);
                }
            }
            topicList.appendChild(row);
        }
        console.log("Topics rendered successfully");
    }

    // Запуск теста
    function startQuiz(category) {
        console.log("Starting new test for category:", category);
        currentCategory = category;
        currentQuestions = (category === 'All Questions') ? [...questionsData] : questionsData.filter(q => q.category === category);

        if (currentQuestions.length === 0) {
            alert(currentLanguage === 'ru' ? `Нет вопросов для категории "${currentCategory}"` : `No questions found for category "${currentCategory}"`);
            return;
        }

        // Полный сброс состояния для нового теста
        currentQuestionIndex = 0;
        userAnswers = [];
        mistakes = new Set();
        mistakeHistory = new Set();
        selectedAnswer = null;
        console.log("State reset, new mistakeHistory:", mistakeHistory);

        currentQuestions.sort(() => Math.random() - 0.5);
        currentQuestions.forEach((question) => {
            console.log("Processing question:", question.questionRu, "Answer:", question.answerRu);
            // Генерация вариантов ответа на основе английского языка
            const optionsEn = [question.answerEn]; // Начинаем с правильного ответа

            // Собираем все вопросы, кроме текущего
            const otherQuestions = questionsData.filter(q => q.id !== question.id);
            console.log("Other questions count:", otherQuestions.length);

            // Добавляем 3 уникальных неправильных ответа на английском
            while (optionsEn.length < 4) {
                const randomQuestion = otherQuestions[Math.floor(Math.random() * otherQuestions.length)];
                const wrongAnswerEn = randomQuestion.answerEn;
                if (!optionsEn.includes(wrongAnswerEn) && wrongAnswerEn !== question.answerEn) {
                    optionsEn.push(wrongAnswerEn);
                }
            }

            // Если недостаточно уникальных ответов, добавляем заглушки
            while (optionsEn.length < 4) {
                const dummyIndex = optionsEn.length;
                optionsEn.push(`Dummy answer EN ${dummyIndex}`);
            }

            // Создаем варианты на русском, сохраняя порядок
            const optionsRu = optionsEn.map(option => {
                if (option === question.answerEn) {
                    return question.answerRu;
                }
                const matchingQuestion = otherQuestions.find(q => q.answerEn === option);
                return matchingQuestion ? matchingQuestion.answerRu : `Заглушка RU ${optionsEn.indexOf(option)}`;
            });

            // Перемешиваем варианты один раз, сохраняя соответствие между языками
            const indices = Array.from({ length: optionsEn.length }, (_, i) => i);
            const shuffledIndices = indices.sort(() => Math.random() - 0.5);
            const shuffledOptionsEn = shuffledIndices.map(i => optionsEn[i]);
            const shuffledOptionsRu = shuffledIndices.map(i => optionsRu[i]);

            // Сохраняем перемешанные варианты и определяем индекс правильного ответа
            question.shuffledOptionsEn = shuffledOptionsEn;
            question.shuffledOptionsRu = shuffledOptionsRu;
            question.shuffledCorrectAnswerIndex = shuffledOptionsEn.indexOf(question.answerEn);
            console.log("Shuffled Options (EN):", shuffledOptionsEn, "Shuffled Options (RU):", shuffledOptionsRu, "Correct Index:", question.shuffledCorrectAnswerIndex);

            // Проверка, что правильный ответ присутствует
            if (question.shuffledCorrectAnswerIndex === -1) {
                console.error("Ошибка: Правильный ответ не найден в вариантах!", question.questionEn, shuffledOptionsEn);
                shuffledOptionsEn[0] = question.answerEn;
                shuffledOptionsRu[0] = question.answerRu;
                question.shuffledCorrectAnswerIndex = 0;
                console.log("Исправлено: Правильный ответ добавлен", shuffledOptionsEn);
            }

            // Проверка соответствия индексов
            if (shuffledOptionsRu[question.shuffledCorrectAnswerIndex] !== question.answerRu) {
                console.error("Несоответствие правильного ответа на русском!", shuffledOptionsRu, question.answerRu);
            }
        });

        if (themeSelection) themeSelection.style.display = 'none';
        if (testContainer) testContainer.style.display = 'block';
        if (resultContainer) resultContainer.style.display = 'none';

        updateTitle();
        loadQuestion();
        updateButtonText();
    }

    // Загрузка вопроса
    function loadQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            showResults();
            return;
        }

        const question = currentQuestions[currentQuestionIndex];
        if (questionText) questionText.textContent = currentLanguage === 'ru' ? question.questionRu : question.questionEn;
        if (levelIndicator) levelIndicator.innerHTML = `<span class="level-circle ${question.level.toLowerCase()}"></span>${question.level}`;
        if (questionCounter) questionCounter.textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;

        if (optionsDiv) {
            optionsDiv.innerHTML = '';
            const shuffledOptions = currentLanguage === 'ru' ? question.shuffledOptionsRu : question.shuffledOptionsEn;
            const correctAnswerIndex = question.shuffledCorrectAnswerIndex;

            shuffledOptions.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.onclick = () => selectAnswer(index, question);
                if (selectedAnswer !== null) {
                    if (index === selectedAnswer) {
                        button.classList.add(index === correctAnswerIndex ? 'correct' : 'wrong');
                    } else if (index === correctAnswerIndex && (selectedAnswer === correctAnswerIndex || userAnswers[currentQuestionIndex] === correctAnswerIndex)) {
                        button.classList.add('correct');
                    }
                }
                optionsDiv.appendChild(button);
            });
        }
        updateButtonText();
    }

    // Выбор ответа
    function selectAnswer(index, question) {
        selectedAnswer = index;
        userAnswers[currentQuestionIndex] = index;

        const correctAnswer = currentLanguage === 'ru' ? question.answerRu : question.answerEn;
        const selectedOption = (currentLanguage === 'ru' ? question.shuffledOptionsRu : question.shuffledOptionsEn)[index];
        const isCorrect = selectedOption === correctAnswer;

        console.log(`Question ID: ${question.id}, Selected Option: ${selectedOption} (index: ${index}), Correct Answer: ${correctAnswer} (index: ${question.shuffledCorrectAnswerIndex}), Is Correct: ${isCorrect}`);

        if (!isCorrect) {
            mistakeHistory.add(currentQuestionIndex);
            mistakes.add(currentQuestionIndex);
            console.log(`Selected wrong answer for question ID ${question.id}: ${selectedOption} (index: ${index}), Correct: ${correctAnswer} (index: ${question.shuffledCorrectAnswerIndex}), MistakeHistory:`, mistakeHistory);
        } else {
            mistakes.delete(currentQuestionIndex);
            console.log(`Selected correct answer for question ID ${question.id}: ${selectedOption} (index: ${index}), Correct: ${correctAnswer} (index: ${question.shuffledCorrectAnswerIndex}), MistakeHistory:`, mistakeHistory);
        }

        loadQuestion();
    }

    // Обработка "Не знаю"
    function dontKnow() {
        const question = currentQuestions[currentQuestionIndex];
        const correctAnswerIndex = question.shuffledCorrectAnswerIndex;

        selectedAnswer = correctAnswerIndex;
        userAnswers[currentQuestionIndex] = correctAnswerIndex;
        mistakeHistory.add(currentQuestionIndex);
        mistakes.add(currentQuestionIndex);
        console.log(`Don't know pressed for question ID ${question.id}, Correct answer selected: ${(currentLanguage === 'ru' ? question.shuffledOptionsRu : question.shuffledOptionsEn)[correctAnswerIndex]} (index: ${correctAnswerIndex}), MistakeHistory:`, mistakeHistory);

        loadQuestion();
    }

    // Переход к следующему вопросу
    function nextQuestion() {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            selectedAnswer = null;
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    }

    // Показ результатов
    function showResults() {
        if (testContainer) testContainer.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'block';

        if (resultBody) {
            resultBody.innerHTML = '';
            if (mistakeHistory.size === 0) {
                // Если нет ошибок
                resultBody.innerHTML = `<tr><td colspan="2">${currentLanguage === 'ru' ? 'Ошибок нет! Отличная работа!' : 'No mistakes! Great job!'}</td></tr>`;
            } else {
                // Если есть ошибки, отображаем таблицу со всеми ошибками
                currentQuestions.forEach((question, index) => {
                    if (mistakeHistory.has(index)) {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                        <td>${currentLanguage === 'ru' ? question.questionRu : question.questionEn}</td>
                        <td>${currentLanguage === 'ru' ? question.answerRu : question.answerEn}</td>
                    `;
                        resultBody.appendChild(tr);
                    }
                });
            }
        }
        console.log("Showing results, mistakes:", mistakeHistory);
    }


    // // Показ результатов
    // function showResults() {
    //     if (testContainer) testContainer.style.display = 'none';
    //     if (resultContainer) resultContainer.style.display = 'block';
    //
    //     if (resultBody) {
    //         resultBody.innerHTML = '';
    //         currentQuestions.forEach((question, index) => {
    //             if (mistakeHistory.has(index)) {
    //                 const tr = document.createElement('tr');
    //                 tr.innerHTML = `
    //                     <td>${currentLanguage === 'ru' ? question.questionRu : question.questionEn}</td>
    //                     <td>${currentLanguage === 'ru' ? question.answerRu : question.answerEn}</td>
    //                 `;
    //                 resultBody.appendChild(tr);
    //             }
    //         });
    //         if (mistakeHistory.size === 0) {
    //             resultBody.innerHTML = `<tr><td colspan="2">${currentLanguage === 'ru' ? 'Ошибок нет! Отличная работа!' : 'No mistakes! Great job!'}</td></tr>`;
    //         } else if (mistakeHistory.size === currentQuestions.length) {
    //             resultBody.innerHTML = `<tr><td colspan="2">${currentLanguage === 'ru' ? 'Все ответы неверные!' : 'All answers are wrong!'}</td></tr>`;
    //         }
    //     }
    //     console.log("Showing results, mistakes:", mistakeHistory);
    // }

    // Остановка теста
    function stopQuiz() {
        if (stopBtn) {
            showResults();
        }
    }

    // Назначение обработчика для кнопки "Стоп"
    if (stopBtn) {
        stopBtn.onclick = stopQuiz;
    }

    // Возврат на главную страницу
    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            if (resultContainer) resultContainer.style.display = 'none';
            if (themeSelection) themeSelection.style.display = 'block';
            if (testContainer) testContainer.style.display = 'none';
            currentCategory = null;
            currentQuestionIndex = 0;
            userAnswers = [];
            mistakes = new Set();
            mistakeHistory = new Set();
            selectedAnswer = null;
            updateButtonText();
            updateTitle();
            renderTopics();
        });
    }

    // Инициализация
    updateLanguage();
    if (topicList) {
        renderTopics();
    } else {
        console.error("Ошибка: Элемент topicList не найден в DOM при инициализации");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category && !topicList) {
        startQuiz(decodeURIComponent(category));
    }
};
