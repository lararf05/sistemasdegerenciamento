document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const notifications = document.getElementById('notifications');
    const filterStatusButton = document.getElementById('filterStatus');
    const filterPriorityButton = document.getElementById('filterPriority');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filterStatus = 'all';
    let filterPriority = false;

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filterStatus === 'concluídas') return task.completed;
            if (filterStatus === 'pendentes') return !task.completed;
            return true;
        });

        const sortedTasks = filterPriority ? filteredTasks.sort((a, b) => {
            return (a.priority < b.priority ? -1 : 1);
        }) : filteredTasks;

        sortedTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${task.name} - ${task.dueDate} - ${task.priority}</span>
                <button onclick="editTask(${index})">Editar</button>
                <button onclick="toggleCompletion(${index})">${task.completed ? 'Marcar como Pendente' : 'Concluir'}</button>
                <button onclick="deleteTask(${index})">Excluir</button>
            `;
            taskList.appendChild(li);
        });

        showNotifications();
    }

    function showNotifications() {
        notifications.innerHTML = '';
        const now = new Date();
        const urgentTasks = tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return !task.completed && (dueDate - now <= 24 * 60 * 60 * 1000);
        });

        urgentTasks.forEach(task => {
            const div = document.createElement('div');
            div.className = 'notification';
            div.innerText = `Atenção! A tarefa "${task.name}" está próxima do prazo!`;
            notifications.appendChild(div);
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const dueDate = document.getElementById('dueDate').value;
        const priority = document.getElementById('priority').value;

        tasks.push({ name: taskName, dueDate, priority, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskForm.reset();
        renderTasks();
    });

    filterStatusButton.addEventListener('click', () => {
        filterStatus = filterStatus === 'all' ? 'concluídas' : (filterStatus === 'concluídas' ? 'pendentes' : 'all');
        filterStatusButton.innerText = filterStatus === 'all' ? 'Filtrar por Status' : `Mostrar ${filterStatus}`;
        renderTasks();
    });

    filterPriorityButton.addEventListener('click', () => {
        filterPriority = !filterPriority;
        filterPriorityButton.innerText = filterPriority ? 'Desativar Filtro de Prioridade' : 'Filtrar por Prioridade';
        renderTasks();
    });

    window.editTask = function(index) {
        const task = tasks[index];
        document.getElementById('taskName').value = task.name;
        document.getElementById('dueDate').value = task.dueDate;
        document.getElementById('priority').value = task.priority;
        deleteTask(index); 
    };

    window.toggleCompletion = function(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    renderTasks();
});
