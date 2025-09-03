import { Component, OnInit } from '@angular/core';
import { Task } from '../../core/models/Task';
import { TaskServiceService as TaskService } from '../../core/services/task-service.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas', err);
        this.loading = false;
      }
    });
  }

  openNewTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((newTask: Task | undefined) => {
      if (newTask) {
        this.tasks.push(newTask);
        // Opcional: salvar no backend
        this.taskService.createTask(newTask).subscribe({
          next: () => console.log('Tarefa criada com sucesso'),
          error: (err) => console.error('Erro ao criar tarefa', err)
        });
      }
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'high';
      case 'media':
      case 'medium':
        return 'medium';
      case 'baixa':
      case 'low':
        return 'low';
      default:
        return '';
    }
  }
}
