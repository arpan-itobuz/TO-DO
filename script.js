const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("active");
const completeBtn = document.getElementById("complete");
const clearBtn = document.getElementById("clear");
const footerBtns = document.getElementsByClassName("footer-button"); 
const alertBox = document.getElementById("alert"); 
let tasks = JSON.parse(localStorage.getItem('tasks')) || {}; 

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const todo = (filter) => {
    todoList.innerHTML = "";
    for (const task in tasks) {
        if (!tasks.hasOwnProperty(task)) continue;

        const isComplete = tasks[task];
        if (filter === 'all' || (filter === 'active' && !isComplete) || (filter === 'complete' && isComplete)) {
            const newTask = document.createElement("div");
            const taskname = document.createElement("p");
            const taskBtnContainer = document.createElement("div");
            const checkBtn = document.createElement("button");
            const checkIcon = document.createElement("img");
            const deleteBtn = document.createElement("button");
            const deleteIcon = document.createElement("img");

            taskname.textContent = task;
            taskname.classList.add("task-name");
            if (isComplete) {
                taskname.classList.add("complete-task");
            }

            taskBtnContainer.classList.add("task-btn-container"); 
            checkBtn.classList.add("task-btn", "checkTask");
            checkBtn.setAttribute("onClick", `completeTask('${task}')`);
            checkIcon.src = "images/checked.png";
            checkIcon.classList.add("task-icon");
            checkBtn.appendChild(checkIcon);

            deleteBtn.classList.add("task-btn", "deleteTask");
            deleteBtn.setAttribute("onClick", `deleteTask('${task}')`);
            deleteIcon.src = "images/delete.svg";
            deleteIcon.classList.add("task-icon");
            deleteBtn.appendChild(deleteIcon);

            taskBtnContainer.appendChild(checkBtn);
            taskBtnContainer.appendChild(deleteBtn);

            newTask.appendChild(taskname);
            newTask.appendChild(taskBtnContainer);
            newTask.classList.add("task-container");

            todoList.appendChild(newTask);
        }
    }
    console.log("Current tasks: ", tasks);
};

const addTask = () => {
    const task = todoInput.value.trim();
    todoInput.value = "";

    if (task !== "") {
        if (!tasks.hasOwnProperty(task)) { 
            tasks = { [task]: false, ...tasks }; 
            console.log(`Task "${task}" added.`);
            saveToLocalStorage();
        } else {
            alertBox.style.display = 'block';
            alertBox.textContent = "Task already exists!";
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 2000);
        }
    }
    todo('all');
};

addBtn.addEventListener("click", () => {
    addTask();
});

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

const deleteTask = (task) => {
    delete tasks[task];
    console.log(`Task "${task}" deleted.`);
    saveToLocalStorage();
    todo('all');
};

const completeTask = (task) => {
    if (tasks.hasOwnProperty(task)) {
        tasks[task] = !tasks[task]; 
        console.log(`Task "${task}" marked as ${tasks[task] ? "complete" : "incomplete"}.`);
        saveToLocalStorage();
    }

    if (allBtn.classList.contains("active")) {
        todo('all');
    } else if (completeBtn.classList.contains("active")) {
        todo('complete');
    } else {
        activeTask();
    }
};

const activeTask = () => {
    todo('active');
    removeActiveClass();
    activeBtn.classList.add("active");
};

const removeActiveClass = () => {
    Array.from(footerBtns).forEach((footerBtn) => { 
        footerBtn.classList.remove("active");
    });
};

allBtn.addEventListener("click", () => {
    todo('all');
    removeActiveClass();
    allBtn.classList.add("active");
});

activeBtn.addEventListener("click", () => {
    activeTask();
});

completeBtn.addEventListener("click", () => {
    todo('complete');
    removeActiveClass();
    completeBtn.classList.add("active");
});

clearBtn.addEventListener("click", () => {
    for (const task in tasks) {
        if (tasks[task]) {
            delete tasks[task];
            console.log(`Completed task "${task}" cleared.`);
        }
    }
    saveToLocalStorage();
    todo('all');
    removeActiveClass();
    clearBtn.classList.add("active");
});

document.addEventListener("DOMContentLoaded", () => {
    todo('all');
});
