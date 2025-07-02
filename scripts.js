class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.clearAll = document.getElementById('clearAll');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });

        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        this.clearAll.addEventListener('click', () => this.clearAllTasks());
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('todoTasks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) {
            this.taskInput.focus();
            return;
        }

        const task = {
            id: this.generateId(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.taskInput.value = '';
        this.saveTasks();
        this.render();
        this.taskInput.focus();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        if (completedCount === 0) {
            alert('Não há tarefas concluídas para limpar.');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir ${completedCount} tarefa(s) concluída(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
    }

    clearAllTasks() {
        if (this.tasks.length === 0) {
            alert('Não há tarefas para limpar.');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir todas as ${this.tasks.length} tarefa(s)?`)) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days === 1) return 'Ontem';
        if (days < 7) return `${days} dias atrás`;

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            default:
                return this.tasks;
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask('${task.id}')">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <span class="task-date">${this.formatDate(task.createdAt)}</span>
            <button class="delete-btn" onclick="todoApp.deleteTask('${task.id}')" title="Excluir tarefa">
                <i class="fas fa-trash"></i>
            </button>
        `;

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render() {
        this.updateStats();

        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            this.tasksList.style.display = 'none';
            this.emptyState.style.display = 'block';

            // Personalizar mensagem do estado vazio baseado no filtro
            const emptyMessages = {
                all: {
                    icon: 'fas fa-clipboard-list',
                    title: 'Nenhuma tarefa ainda',
                    subtitle: 'Adicione sua primeira tarefa acima'
                },
                pending: {
                    icon: 'fas fa-check-circle',
                    title: 'Todas as tarefas concluídas!',
                    subtitle: 'Parabéns pelo seu progresso'
                },
                completed: {
                    icon: 'fas fa-clock',
                    title: 'Nenhuma tarefa concluída',
                    subtitle: 'Complete algumas tarefas para vê-las aqui'
                }
            };

            const message = emptyMessages[this.currentFilter];
            this.emptyState.innerHTML = `
                <i class="${message.icon}"></i>
                <h3>${message.title}</h3>
                <p>${message.subtitle}</p>
            `;
        } else {
            this.tasksList.style.display = 'block';
            this.emptyState.style.display = 'none';

            this.tasksList.innerHTML = '';
            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                this.tasksList.appendChild(taskElement);
            });
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Adicionar alguns atalhos de teclado úteis
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para focar no input
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('taskInput').focus();
        e.preventDefault();
    }

    // Escape para limpar o input
    if (e.key === 'Escape') {
        const input = document.getElementById('taskInput');
        if (document.activeElement === input) {
            input.value = '';
        }
    }
});