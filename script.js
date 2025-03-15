// Глобальные переменные
let currentLanguage = localStorage.getItem('language') || 'ru';
let currentCategory = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let mistakes = new Set();
let selectedAnswer = null;

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
const title = document.getElementById('title');
const quizTitle = document.getElementById('quiz-title');
const topicsTitle = document.getElementById('topics-title');
const topicList = document.getElementById('topicList');

// Обработчик переключения языка
document.querySelectorAll('.language-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (currentLanguage !== lang) {
            currentLanguage = lang;
            localStorage.setItem('language', currentLanguage);
            document.querySelector('.language-buttons button.active').classList.remove('active');
            btn.classList.add('active');
            updateLanguageButtons();
            updateButtonText();
            updateTitle();
            updateTableHeaders();
            if (testContainer.style.display === 'block') {
                loadQuestion(); // Обновляем текущий вопрос при смене языка
            }
            if (resultContainer.style.display === 'block') {
                showResults(); // Обновляем результаты при смене языка
            }
            renderTopics(); // Перерендериваем темы
        }
    });
});

// Обновление текста заголовка
function updateTitle() {
    const titles = {
        ru: 'Тест по собеседованию Java ☕',
        en: 'Java Interview Test ☕'
    };
    title.textContent = titles[currentLanguage];
    topicsTitle.textContent = currentLanguage === 'ru' ? 'Список тем' : 'List of Topics';
    // Обновляем заголовок теста
    if (currentCategory) {
        const categoryText = currentLanguage === 'ru' ? currentCategory : {
            "Java Core": "Java Core",
            "Объектно-ориентированное программирование (ООП)": "Object-Oriented Programming (OOP)",
            "JVM, JDK, JRE": "JVM, JDK, JRE Internals",
            "Память JVM и сборка мусора": "JVM Memory Management & Garbage Collection",
            "Исключения и обработка ошибок": "Exceptions & Error Handling",
            "Коллекции": "Collections Framework",
            "Многопоточность и конкурентность": "Multithreading & Concurrency",
            "Потоки ввода-вывода (IO/NIO)": "Input/Output Streams (IO/NIO)",
            "Java 8+ (Lambdas, Streams, Functional Interfaces)": "Java 8+ Features (Lambdas, Streams, Functional Interfaces)",
            "JDBC и базы данных": "JDBC & Databases (SQL, JDBC)",
            "JPA и Hibernate (ORM)": "ORM & Hibernate",
            "SQL и NoSQL базы данных": "SQL & NoSQL Databases",
            "Шаблоны проектирования": "Design Patterns",
            "Spring Framework": "Spring Framework",
            "Apache Kafka": "Apache Kafka",
            "REST API и веб-сервисы": "RESTful APIs & Web Services",
            "Тестирование (JUnit, Mockito, TDD)": "Testing (JUnit, Mockito, TDD)",
            "Системы сборки и управление зависимостями (Maven, Gradle)": "Build Tools (Maven, Gradle)",
            "Git и системы контроля версий": "Git & Version Control Systems",
            "Docker и контейнеризация": "Docker & Containers",
            "Архитектура и дизайн приложений": "Application Architecture & System Design",
            "Алгоритмы и структуры данных": "Algorithms & Data Structures",
            "Все вопросы": "All Questions"
        }[currentCategory] || currentCategory;
        quizTitle.textContent = currentLanguage === 'ru' ? `Тест: ${currentCategory}` : `Quiz: ${categoryText}`;
        resultTitle.textContent = currentLanguage === 'ru' ? `Результаты: ${currentCategory}` : `Results: ${categoryText}`;
    }
}

// Обновление заголовков таблицы
function updateTableHeaders() {
    const tableHeaders = document.querySelectorAll('#result-table th');
    tableHeaders[0].textContent = currentLanguage === 'ru' ? 'Вопрос' : 'Question';
    tableHeaders[1].textContent = currentLanguage === 'ru' ? 'Правильный ответ' : 'Correct Answer';
}

// Обновление активной кнопки языка
function updateLanguageButtons() {
    document.querySelectorAll('.language-buttons button').forEach(btn => {
        const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Обновление текста кнопок
function updateButtonText() {
    stopBtn.textContent = currentLanguage === 'ru' ? 'Стоп' : 'Stop';
    nextOrDontKnowBtn.textContent = selectedAnswer === null ? (currentLanguage === 'ru' ? 'Не знаю' : "Don't know") :
        (selectedAnswer === currentQuestions[currentQuestionIndex]?.shuffledCorrectAnswerIndex ? (currentLanguage === 'ru' ? 'Далее' : 'Next') : (currentLanguage === 'ru' ? 'Не знаю' : "Don't know"));
    returnBtn.textContent = currentLanguage === 'ru' ? 'Вернуться в начало' : 'Return to Start';
}

// Рендеринг тем в 3 столбца
function renderTopics() {
    console.log('Rendering topics...');
    if (!categories || categories.length === 0) {
        console.error('Categories array is empty or undefined');
        topicList.innerHTML = '<p>Ошибка: Список тем не загружен.</p>';
        return;
    }
    topicList.innerHTML = '';
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
                const categoryText = currentLanguage === 'ru' ? categories[index] : {
                    "Java Core": "Java Core",
                    "Объектно-ориентированное программирование (ООП)": "Object-Oriented Programming (OOP)",
                    "JVM, JDK, JRE": "JVM, JDK, JRE Internals",
                    "Память JVM и сборка мусора": "JVM Memory Management & Garbage Collection",
                    "Исключения и обработка ошибок": "Exceptions & Error Handling",
                    "Коллекции": "Collections Framework",
                    "Многопоточность и конкурентность": "Multithreading & Concurrency",
                    "Потоки ввода-вывода (IO/NIO)": "Input/Output Streams (IO/NIO)",
                    "Java 8+ (Lambdas, Streams, Functional Interfaces)": "Java 8+ Features (Lambdas, Streams, Functional Interfaces)",
                    "JDBC и базы данных": "JDBC & Databases (SQL, JDBC)",
                    "JPA и Hibernate (ORM)": "ORM & Hibernate",
                    "SQL и NoSQL базы данных": "SQL & NoSQL Databases",
                    "Шаблоны проектирования": "Design Patterns",
                    "Spring Framework": "Spring Framework",
                    "Apache Kafka": "Apache Kafka",
                    "REST API и веб-сервисы": "RESTful APIs & Web Services",
                    "Тестирование (JUnit, Mockito, TDD)": "Testing (JUnit, Mockito, TDD)",
                    "Системы сборки и управление зависимостями (Maven, Gradle)": "Build Tools (Maven, Gradle)",
                    "Git и системы контроля версий": "Git & Version Control Systems",
                    "Docker и контейнеризация": "Docker & Containers",
                    "Архитектура и дизайн приложений": "Application Architecture & System Design",
                    "Алгоритмы и структуры данных": "Algorithms & Data Structures",
                    "Все вопросы": "All Questions"
                }[categories[index]] || categories[index];
                button.appendChild(numberSpan);
                button.appendChild(document.createTextNode(` ${categoryText}`));
                button.addEventListener('click', () => startQuiz(categories[index]));
                row.appendChild(button);
            }
        }
        topicList.appendChild(row);
    }
    console.log('Topics rendered successfully');
}

// Запуск теста
function startQuiz(category) {
    currentCategory = category;
    // Фильтрация вопросов по категории с учетом языка
    const categoryKey = currentLanguage === 'ru' ? category : Object.keys({
        "Java Core": "Java Core",
        "Объектно-ориентированное программирование (ООП)": "Object-Oriented Programming (OOP)",
        "JVM, JDK, JRE": "JVM, JDK, JRE Internals",
        "Память JVM и сборка мусора": "JVM Memory Management & Garbage Collection",
        "Исключения и обработка ошибок": "Exceptions & Error Handling",
        "Коллекции": "Collections Framework",
        "Многопоточность и конкурентность": "Multithreading & Concurrency",
        "Потоки ввода-вывода (IO/NIO)": "Input/Output Streams (IO/NIO)",
        "Java 8+ (Lambdas, Streams, Functional Interfaces)": "Java 8+ Features (Lambdas, Streams, Functional Interfaces)",
        "JDBC и базы данных": "JDBC & Databases (SQL, JDBC)",
        "JPA и Hibernate (ORM)": "ORM & Hibernate",
        "SQL и NoSQL базы данных": "SQL & NoSQL Databases",
        "Шаблоны проектирования": "Design Patterns",
        "Spring Framework": "Spring Framework",
        "Apache Kafka": "Apache Kafka",
        "REST API и веб-сервисы": "RESTful APIs & Web Services",
        "Тестирование (JUnit, Mockito, TDD)": "Testing (JUnit, Mockito, TDD)",
        "Системы сборки и управление зависимостями (Maven, Gradle)": "Build Tools (Maven, Gradle)",
        "Git и системы контроля версий": "Git & Version Control Systems",
        "Docker и контейнеризация": "Docker & Containers",
        "Архитектура и дизайн приложений": "Application Architecture & System Design",
        "Алгоритмы и структуры данных": "Algorithms & Data Structures",
        "Все вопросы": "All Questions"
    })[category] || category;

    currentQuestions = category === 'Все вопросы' || category === 'All Questions' ? [...questionsData] : questionsData.filter(q => q.category === categoryKey);

    console.log(`Selected category: ${currentCategory}, Found questions: ${currentQuestions.length}`);
    if (currentQuestions.length === 0) {
        alert(currentLanguage === 'ru' ? `Нет вопросов для категории "${currentCategory}"` : `No questions found for category "${currentCategory}"`);
        return;
    }

    // Рандомизация вопросов и вариантов ответов один раз
    currentQuestions.sort(() => Math.random() - 0.5);
    currentQuestions.forEach(question => {
        const options = currentLanguage === 'ru' ? [...question.optionsRu] : [...question.optionsEn];
        question.originalOptions = [...options];
        const shuffledOptions = [...options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        question.shuffledOptions = shuffledOptions;
        question.shuffledCorrectAnswerIndex = shuffledOptions.indexOf(
            currentLanguage === 'ru' ? question.optionsRu[question.correctAnswer] : question.optionsEn[question.correctAnswer]
        );
    });

    currentQuestionIndex = 0;
    userAnswers = [];
    mistakes.clear();
    selectedAnswer = null;
    themeSelection.style.display = 'none';
    testContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    updateTitle(); // Обновляем заголовок теста
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
    questionText.textContent = currentLanguage === 'ru' ? question.questionRu : question.questionEn;
    levelIndicator.innerHTML = `<span class="level-circle ${question.level.toLowerCase()}"></span>${question.level}`;
    questionCounter.textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;

    optionsDiv.innerHTML = '';
    // Обновляем варианты ответов в зависимости от текущего языка
    const options = currentLanguage === 'ru' ? question.optionsRu : question.optionsEn;
    const shuffledOptions = [...options]; // Создаем новый массив для текущего языка
    // Используем порядок из shuffledOptions, если он уже определен
    if (question.shuffledOptions && question.shuffledOptions.length === options.length) {
        shuffledOptions.forEach((_, index) => {
            shuffledOptions[index] = options[question.shuffledOptions.indexOf(question.originalOptions[index])];
        });
    } else {
        // Если shuffledOptions еще не определен, рандомизируем один раз
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        question.shuffledOptions = shuffledOptions;
    }
    question.shuffledCorrectAnswerIndex = shuffledOptions.indexOf(
        currentLanguage === 'ru' ? question.optionsRu[question.correctAnswer] : question.optionsEn[question.correctAnswer]
    );

    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => selectAnswer(index, question.shuffledCorrectAnswerIndex);
        if (selectedAnswer !== null) {
            if (index === selectedAnswer) {
                button.classList.add(index === question.shuffledCorrectAnswerIndex ? 'correct' : 'wrong');
            } else if (index === question.shuffledCorrectAnswerIndex && selectedAnswer === question.shuffledCorrectAnswerIndex) {
                button.classList.add('correct');
            }
        }
        optionsDiv.appendChild(button);
    });

    nextOrDontKnowBtn.onclick = selectedAnswer === null || selectedAnswer !== question.shuffledCorrectAnswerIndex ? dontKnow : nextQuestion;
    updateButtonText();
}

// Выбор ответа
function selectAnswer(index, correctAnswerIndex) {
    selectedAnswer = index;
    userAnswers[currentQuestionIndex] = index;
    if (index !== correctAnswerIndex) {
        mistakes.add(currentQuestionIndex);
    }
    loadQuestion();
}

// Обработка "Не знаю"
function dontKnow() {
    const question = currentQuestions[currentQuestionIndex];
    const correctAnswerIndex = question.shuffledCorrectAnswerIndex;
    selectedAnswer = correctAnswerIndex;
    userAnswers[currentQuestionIndex] = selectedAnswer;
    mistakes.add(currentQuestionIndex);
    nextOrDontKnowBtn.textContent = currentLanguage === 'ru' ? 'Далее' : 'Next';
    nextOrDontKnowBtn.onclick = nextQuestion;
    loadQuestion();
}

// Обработка "Далее"
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
    testContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    resultBody.innerHTML = '';
    mistakes.forEach(index => {
        const question = currentQuestions[index];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${currentLanguage === 'ru' ? question.questionRu : question.questionEn}</td>
            <td>${currentLanguage === 'ru' ? question.optionsRu[question.correctAnswer] : question.optionsEn[question.correctAnswer]}</td>
        `;
        resultBody.appendChild(tr);
    });

    if (mistakes.size === 0) {
        resultBody.innerHTML = `<tr><td colspan="2">${currentLanguage === 'ru' ? 'Ошибок нет! Отличная работа!' : 'No mistakes! Great job!'}</td></tr>`;
    }

    updateButtonText();
    updateTitle();
    updateTableHeaders();
}

stopBtn.addEventListener('click', stopQuiz);

function stopQuiz() {
    showResults();
}

returnBtn.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    themeSelection.style.display = 'block';
    testContainer.style.display = 'none';
    currentCategory = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    mistakes.clear();
    selectedAnswer = null;
    updateButtonText();
    updateTitle();
    renderTopics();
});

window.onload = () => {
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
    renderTopics();
};

// Данные вопросов
const questionsData = [
    {
        id: 1,
        category: "Java Core",
        level: "Junior",
        questionEn: "Is Java Platform Independent? If so, how?",
        questionRu: "Является ли Java платформонезависимой? Если да, то как?",
        optionsEn: ["Yes, Java is platform independent due to JVM", "No, Java depends on the OS", "Java requires native code", "Java runs without JVM"],
        optionsRu: ["Да, Java платформонезависима благодаря JVM", "Нет, Java зависит от ОС", "Java требует нативный код", "Java работает без JVM"],
        correctAnswer: 0
    },
    {
        id: 2,
        category: "Java Core",
        level: "Junior",
        questionEn: "What are the top Java Features?",
        questionRu: "Какие основные особенности Java?",
        optionsEn: ["Simple, Platform Independent, Object-Oriented", "Complex, Platform Dependent, Slow", "No features", "Only OOP"],
        optionsRu: ["Простота, платформонезависимость, ООП", "Сложность, зависимость от платформы, медленная", "Нет особенностей", "Только ООП"],
        correctAnswer: 0
    },
    {
        id: 3,
        category: "JVM, JDK, JRE",
        level: "Middle",
        questionEn: "What is JVM?",
        questionRu: "Что такое JVM?",
        optionsEn: ["Java Virtual Machine", "Java Version Manager", "Java Memory Unit", "Java Compiler"],
        optionsRu: ["Виртуальная машина Java", "Менеджер версий Java", "Единица памяти Java", "Компилятор Java"],
        correctAnswer: 0
    },
    {
        id: 4,
        category: "Память JVM и сборка мусора",
        level: "Middle",
        questionEn: "What is JIT?",
        questionRu: "Что такое JIT?",
        optionsEn: ["Just-in-Time compiler", "Java Interpreter", "Bytecode Generator", "Memory Manager"],
        optionsRu: ["Компилятор Just-in-Time", "Интерпретатор Java", "Генератор байт-кода", "Менеджер памяти"],
        correctAnswer: 0
    },
    {
        id: 5,
        category: "Память JVM и сборка мусора",
        level: "Middle",
        questionEn: "What are the Memory stores in JVM?",
        questionRu: "Какие области памяти в JVM?",
        optionsEn: ["Class, Heap, Stack", "Only Heap", "Only Stack", "No memory stores"],
        optionsRu: ["Class, Heap, Stack", "Только Heap", "Только Stack", "Нет хранилищ памяти"],
        correctAnswer: 0
    },
    {
        id: 6,
        category: "Память JVM и сборка мусора",
        level: "Middle",
        questionEn: "What is a Classloader?",
        questionRu: "Что такое Classloader?",
        optionsEn: ["Loads classes dynamically", "Compiles Java code", "Manages memory", "Runs bytecode"],
        optionsRu: ["Динамически загружает классы", "Компилирует код Java", "Управляет памятью", "Запускает байт-код"],
        correctAnswer: 0
    },
    {
        id: 7,
        category: "Java Core",
        level: "Junior",
        questionEn: "What are the different JVM implementations?",
        questionRu: "Чем отличаются JVM?",
        optionsEn: ["Interprets bytecode to native code", "Compiles native code to bytecode", "Runs without bytecode", "None"],
        optionsRu: ["Интерпретирует байт-код в нативный код", "Компилирует нативный код в байт-код", "Работает без байт-кода", "Ничего"],
        correctAnswer: 0
    },
    {
        id: 8,
        category: "Java Core",
        level: "Junior",
        questionEn: "What are the different Java platforms?",
        questionRu: "Чем отличаются платформы Java?",
        optionsEn: ["Java SE, Java EE, Java ME", "Only Java SE", "Only Java EE", "No platforms"],
        optionsRu: ["Java SE, Java EE, Java ME", "Только Java SE", "Только Java EE", "Нет платформ"],
        correctAnswer: 0
    },
    {
        id: 9,
        category: "Java Core",
        level: "Junior",
        questionEn: "Explain public static void main(String args[])?",
        questionRu: "Объясните public static void main(String args[])?",
        optionsEn: ["Entry point of a Java program", "A variable declaration", "A loop construct", "A class constructor"],
        optionsRu: ["Точка входа в программу Java", "Объявление переменной", "Конструкция цикла", "Конструктор класса"],
        correctAnswer: 0
    },
    {
        id: 10,
        category: "Java Core",
        level: "Junior",
        questionEn: "What is the difference between JRE, JDK, and JVM?",
        questionRu: "Чем отличается JRE, JDK и JVM?",
        optionsEn: ["JRE runs, JDK develops, JVM executes", "JRE develops, JDK runs, JVM compiles", "JRE compiles, JDK executes, JVM runs", "All are the same"],
        optionsRu: ["JRE запускает, JDK разрабатывает, JVM выполняет", "JRE разрабатывает, JDK запускает, JVM компилирует", "JRE компилирует, JDK выполняет, JVM запускает", "Все одинаковые"],
        correctAnswer: 0
    }
];

const categories = [
    "Java Core",
    "Объектно-ориентированное программирование (ООП)",
    "JVM, JDK, JRE",
    "Память JVM и сборка мусора",
    "Исключения и обработка ошибок",
    "Коллекции",
    "Многопоточность и конкурентность",
    "Потоки ввода-вывода (IO/NIO)",
    "Java 8+ (Lambdas, Streams, Functional Interfaces)",
    "JDBC и базы данных",
    "JPA и Hibernate (ORM)",
    "SQL и NoSQL базы данных",
    "Шаблоны проектирования",
    "Spring Framework",
    "Apache Kafka",
    "REST API и веб-сервисы",
    "Тестирование (JUnit, Mockito, TDD)",
    "Системы сборки и управление зависимостями (Maven, Gradle)",
    "Git и системы контроля версий",
    "Docker и контейнеризация",
    "Архитектура и дизайн приложений",
    "Алгоритмы и структуры данных",
    "Все вопросы"
];
