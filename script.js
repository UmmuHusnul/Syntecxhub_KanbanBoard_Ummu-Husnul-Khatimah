const modal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

let currentColumnId = null;
let draggedTask = null;

window.onload = () => {
    const data = JSON.parse(localStorage.getItem("journalData")) || { todo: [], doing: [], done: [] };
    Object.keys(data).forEach(colId => {
        const list = document.querySelector(`#${colId} .task-list`);
        data[colId].forEach(text => createTaskElement(text, list));
    });
    updateCounts();
};

document.querySelectorAll(".add-task").forEach(btn => {
    btn.onclick = () => {
        currentColumnId = btn.closest(".column").id;
        taskInput.value = "";
        modal.style.display = "flex";
        taskInput.focus();
    };
});

cancelBtn.onclick = () => modal.style.display = "none";

saveBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const list = document.querySelector(`#${currentColumnId} .task-list`);
    createTaskElement(text, list);
    
    saveToLocal();
    modal.style.display = "none";
    updateCounts();
};

function createTaskElement(text, list) {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true; 
    task.innerHTML = `<span>${text}</span><button class="del-btn">×</button>`;

    task.querySelector(".del-btn").onclick = () => {
        task.remove();
        saveToLocal();
        updateCounts();
    };

    addDragEvents(task);
    list.appendChild(task);
}

function addDragEvents(task) {
    task.addEventListener("dragstart", () => {
        draggedTask = task;
        task.classList.add("dragging");
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
        saveToLocal();
        updateCounts();
    });
}

document.querySelectorAll(".task-list").forEach(list => {
    list.addEventListener("dragover", e => {
        e.preventDefault(); 
        list.classList.add("drag-over");
    });

    list.addEventListener("dragleave", () => list.classList.remove("drag-over"));

    list.addEventListener("drop", () => {
        list.classList.remove("drag-over");
        if (draggedTask) {
            list.appendChild(draggedTask);
            saveToLocal();
            updateCounts();
        }
    });
});

function saveToLocal() {
    const data = { todo: [], doing: [], done: [] };
    document.querySelectorAll(".column").forEach(col => {
        col.querySelectorAll(".task span").forEach(s => data[col.id].push(s.innerText));
    });
    localStorage.setItem("journalData", JSON.stringify(data));
}

function updateCounts() {
    document.querySelectorAll(".column").forEach(col => {
        col.querySelector("span").innerText = col.querySelectorAll(".task").length;
    });
}