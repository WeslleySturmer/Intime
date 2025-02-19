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

// função pra atualizar segundos minutos e horas
function update_timer() {
    seconds++
    if (seconds == 60){
        seconds = 0
        minutes ++
        if (minutes == 60) {
            minutes = 0
            hours ++
        }
    }

// formata o tempo separando por dois ponto
const formattedtime = 
String(hours).padStart(2,"0") + ":" +
String(minutes).padStart(2,"0") + ":" +
String(seconds).padStart(2,"0"); 

timerDisplay.textContent = formattedtime
}

startButton.addEventListener("click", () => {
    if (!interval) {
        interval = setInterval(update_timer, 1000);
    }
});

stopButton.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
});

resetButton.addEventListener("click", () => {
    const lastTime = timerDisplay.textContent; //tempo atual
    addTask(lastTime); //cria a tarefa com o tempo registrado

    clearInterval(interval);
    interval = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timerDisplay.textContent = "00:00:00";
});

nextButton.addEventListener("click", () => {
    const lastTime = timerDisplay.textContent; //tempo atual
    addTask(lastTime); //cria a tarefa com o tempo registrado

    clearInterval(interval);
    interval = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timerDisplay.textContent = "00:00:00";

    if (!interval) {
        interval = setInterval(update_timer, 1000);
    }
});


const taskContainer = document.querySelector(".tarefas"); // Captura a barra lateral

function saveTasks() {
    //vai organizar as tasks em chave valor
    const tasks = [];
    document.querySelectorAll(".task").forEach(task => {

        const taskName = task.querySelector(".task-name").value;
        const taskTime = task.querySelector("span").textContent;
        tasks.push({name: taskName, time: taskTime});
    });

    //joga pra o localstorage num json
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//carrega as tasks
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTask(task.time, task.name));
};

//executa ao iniciar a página
window.addEventListener("load", loadTasks)

//funcao pra criar tarefa
function addTask(time, name = "Nova tarefa") {
    //criar elemento da tarefa
    const task = document.createElement("div");
    task.classList.add("task");

    //criar input para editar a tarefa 
    const taskName = document.createElement("input");
    taskName.type = "text";
    taskName.value = name;
    taskName.classList.add("task-name");

    //criar span pra mostrar o tempo registrado
    const taskTime = document.createElement("span");
    taskTime.textContent = time;

    //criar botão de deletar a task
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.classList.add("delete-task");

    //remover a tarefa ao clicar no botão
    deleteButton.addEventListener("click", () => {
        task.remove();
        saveTasks();
    });

    taskName.addEventListener("input", saveTasks);

    //adicionar os elemtentos da tarefa
    task.appendChild(taskName);
    task.appendChild(taskTime);
    task.appendChild(deleteButton);

    //adicionar na div lateral
    taskContainer.appendChild(task);

    // Salvar as tarefas no Local Storage
    saveTasks();
}

document.getElementById("finalizar-dia").addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];

    const tasks = [];
    document.querySelectorAll(".task").forEach(task => {
        const taskName = task.querySelector(".task-name").value;
        const taskTime = task.querySelector("span").textContent;
        tasks.push({name: taskName, time: taskTime})
    });

    //pegar registros anteriores
    let taskHistory = JSON.parse(localStorage.getItem("taskHistory")) || {};

    //salvar a tarefa do dia na chave correspondente
    taskHistory[today] = tasks;
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));

    //limpar as tarefas da lateral
    document.querySelectorAll(".task").forEach(task => task.remove());
    localStorage.removeItem("tasks");
})

//funcao que adicionar o .hidden em historico para ficar visivel task
function showTasks() {
    tarefasArea.classList.remove("hidden");
    historicoArea.classList.add("hidden");
};

//funcao que adicionar o .hidden em task para ficar visivel historico
function showHistory() {
    historicoArea.classList.remove("hidden");
    tarefasArea.classList.add("hidden");
};

//evento de click que executa a função acima
tarefasBtn.addEventListener("click", showTasks);
historicoBtn.addEventListener("click", showHistory);

//quando abrir o navegador vai mostrar as task
window.addEventListener("load", showTasks);