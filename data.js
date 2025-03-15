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
        category: "Память JVM и сборка мусора",
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
