import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  constructor(
  private fb: FormBuilder,
  @Optional() private dialogRef: MatDialogRef<TaskDialogComponent> | null,
  @Optional() @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      // fallback: when component is used outside a MatDialog
      console.warn('TaskDialogComponent: dialogRef not provided (not opened as a MatDialog). onCancel() ignored.');
    }
  }

  onSave(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: this.generateId(),
        ...this.taskForm.value,
        deadline: this.taskForm.value.deadline.toISOString(), // converte Date para string ISO
      };
      if (this.dialogRef) {
        this.dialogRef.close(newTask);
      } else {
        // fallback: emit or handle the created task when not opened as dialog
        console.log('TaskDialogComponent created task (no dialog):', newTask);
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
