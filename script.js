const fileSystem = {
    "home": {
        "file1.txt": "Привет, это файл!",
        "projects": {
            "app.js": "console.log('Hello')"
        },
        "documents": {
            "report.pdf": "Это отчет"
        }
    },
    "docs": {
        "readme.txt": "Это документация",
        "config.json": '{"version": "1.0"}'
    },
    "system": {
        "logs": {
            "error.log": "Ошибка в системе",
            "access.log": "Пользователь вошел в систему"
        }
    }
};

let currentPath = ["home"];
let commandBuffer = "";

const terminal = document.getElementById("terminal");
const input = document.getElementById("commandInput");
const locationSpan = document.getElementById("location");

function printOutput(text) {
    const outputDiv = document.createElement("div");
    outputDiv.textContent = text;
    terminal.appendChild(outputDiv);
    terminal.scrollTop = terminal.scrollHeight;
}

function updateLocation() {
    locationSpan.textContent = currentPath.join("/") + "$ ";
}

function executeCommand(command) {
    const parts = command.trim().split(" ");
    const cmd = parts[0];

    if (cmd === "ls") {
        let dir = fileSystem;
        for (let folder of currentPath) dir = dir[folder];
        printOutput(Object.keys(dir).join(" "));
    } else if (cmd === "cd") {
        const target = parts[1];
        if (target && fileSystem[target] && currentPath.length === 1) {
            currentPath = [target];
        } else if (target && fileSystem[currentPath[0]][target]) {
            currentPath.push(target);
        } else {
            printOutput("Папка не найдена");
        }
        updateLocation();
    } else if (cmd === "cat") {
        const fileName = parts[1];
        let fileContent = null;
        let dir = fileSystem;
        for (let folder of currentPath) dir = dir[folder];
        if (dir[fileName]) {
            fileContent = dir[fileName];
            if (typeof fileContent === "string") {
                printOutput(fileContent);
            } else {
                printOutput("Это папка, а не файл");
            }
        } else {
            printOutput("Файл не найден");
        }
    } else if (cmd === "pwd") {
        printOutput(currentPath.join("/"));
    } else {
        printOutput("Неизвестная команда");
    }
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        printOutput(`> ${input.value}`);
        executeCommand(input.value);
        input.value = "";
        commandBuffer = "";
        updateLocation();
    } else if (e.key === "Backspace") {
        commandBuffer = commandBuffer.slice(0, -1);
    } else {
        commandBuffer += e.key;
    }
    locationSpan.textContent = currentPath.join("/") + "$ " + commandBuffer;
});

updateLocation();

// Автоматическое перемещение фокуса на input при загрузке страницы
input.focus();