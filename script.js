// Pegamos os botões e o timer do HTML
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const nextButton = document.getElementById("next");
const tarefasBtn = document.getElementById("tarefas-btn");
const historicoBtn = document.getElementById("historico-btn");
const tarefasArea = document.getElementById("tarefas-area");
const historicoArea = document.getElementById("historico-area");

// Variáveis para controlar o tempo e o intervalo
let seconds = 0;
let minutes = 0;
let hours = 0;
let interval = null;

// Função para atualizar o timer
function update_timer() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
            minutes = 0;
            hours++;
        }
    }

    // Formata o tempo
    const formattedtime = 
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    timerDisplay.textContent = formattedtime;
}

// Iniciar timer
startButton.addEventListener("click", () => {
    if (!interval) {
        interval = setInterval(update_timer, 1000);
    }
});

// Parar timer
stopButton.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
});

// Resetar timer
resetButton.addEventListener("click", () => {
    const lastTime = timerDisplay.textContent;
    addTask(lastTime);

    clearInterval(interval);
    interval = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timerDisplay.textContent = "00:00:00";
});

// Próxima tarefa (next)
nextButton.addEventListener("click", () => {
    const lastTime = timerDisplay.textContent;
    addTask(lastTime);

    clearInterval(interval);
    interval = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timerDisplay.textContent = "00:00:00";

    interval = setInterval(update_timer, 1000);
});

const taskContainer = document.querySelector(".tarefas");

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(task => {
        const taskName = task.querySelector(".task-name").value;
        const taskTime = task.querySelector("span").textContent;
        tasks.push({ name: taskName, time: taskTime });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTask(task.time, task.name));
}

window.addEventListener("load", loadTasks);

function addTask(time, name = "Nova tarefa") {
    const task = document.createElement("div");
    task.classList.add("task");

    const taskName = document.createElement("input");
    taskName.type = "text";
    taskName.value = name;
    taskName.classList.add("task-name");

    const taskTime = document.createElement("span");
    taskTime.textContent = time;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.classList.add("delete-task");

    deleteButton.addEventListener("click", () => {
        task.remove();
        saveTasks();
    });

    taskName.addEventListener("input", saveTasks);

    task.appendChild(taskName);
    task.appendChild(taskTime);
    task.appendChild(deleteButton);
    taskContainer.appendChild(task);

    saveTasks();
}

document.getElementById("finalizar-dia").addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];

    const tasks = [];
    document.querySelectorAll(".task").forEach(task => {
        const taskName = task.querySelector(".task-name").value;
        const taskTime = task.querySelector("span").textContent;
        tasks.push({ name: taskName, time: taskTime });
    });

    let taskHistory = JSON.parse(localStorage.getItem("taskHistory")) || {};

    // Calcular horas totais
    const totalHours = calculateTotalHours(tasks);

    taskHistory[today] = { tasks, totalHours };
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));

    document.querySelectorAll(".task").forEach(task => task.remove());
    localStorage.removeItem("tasks");
});

function showTasks() {
    tarefasArea.classList.remove("hidden");
    historicoArea.classList.add("hidden");
}

function showHistory() {
    tarefasArea.classList.add("hidden");
    historicoArea.classList.remove("hidden");
}

tarefasBtn.addEventListener("click", showTasks);
historicoBtn.addEventListener("click", showHistory);
window.addEventListener("load", showTasks);

function calculateTotalHours(tasks) {
    return tasks.reduce((total, task) => {
        const [hours, minutes, seconds] = task.time.split(":").map(Number);
        return total + (hours + minutes / 60 + seconds / 3600);
    }, 0);
}

function loadHistory() {
    const taskHistory = JSON.parse(localStorage.getItem("taskHistory")) || {};
    historicoArea.innerHTML = "<h1>Histórico</h1>";

    for (const [date, data] of Object.entries(taskHistory)) {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerHTML = `
            <div>
                <span>${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}</span> <br>
                <span>Total: ${data.totalHours.toFixed(2)} horas</span>
            </div>
            <button class="expand-btn">Ver mais</button>
        `;

        historyItem.querySelector(".expand-btn").addEventListener("click", () => {
            showExpandedHistory(date, data.tasks);
        });

        historicoArea.appendChild(historyItem);
    }
}

function showExpandedHistory(date, tasks) {
    historicoArea.innerHTML = `<h1>Histórico <br> ${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}</h1>`;

    const expandedArea = document.createElement("div");
    expandedArea.classList.add("expanded-history");

    tasks.forEach(task => {
        const taskDetails = document.createElement("div");
        taskDetails.classList.add("expanded-task");
        taskDetails.innerHTML = `
            <div>
                <strong>${task.name}</strong> - <span>${task.time}</span>
            </div>
        `;
        expandedArea.appendChild(taskDetails);
    });

    historicoArea.appendChild(expandedArea);

    const backButton = document.createElement("button");
    backButton.textContent = "Voltar";
    backButton.addEventListener("click", loadHistory);
    historicoArea.appendChild(backButton);
}

historicoBtn.addEventListener("click", () => {
    showHistory();
    loadHistory();
});