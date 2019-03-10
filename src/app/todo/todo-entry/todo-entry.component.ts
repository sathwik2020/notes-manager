import { Component, OnInit } from '@angular/core';
import { TodoService } from './../services/todo-store.service';

import { Store } from '@ngrx/store';
import { Todo } from '../models/todo-model';

import * as TodoActions from '../store/todo.actions';
import { TodosState } from '../store/todo.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-entry',
  templateUrl: './todo-entry.component.html',
  styleUrls: ['./todo-entry.component.css']
})
export class TodoEntryComponent implements OnInit {

  todoName: string = '';
  todoContent:string = '';
  todoId: number;
  todoCreatedOn: Date;
  todoUpdatedOn: Date;
  isEditing:Boolean = false;


  constructor(private todoStoreService: TodoService, private store: Store<TodosState>) {

  }

  ngOnInit() {
    this.getDetails(this.todoStoreService.fetchTodos()[this.todoStoreService.fetchTodos().length -1]);
    this.todoStoreService.selectedTodo.subscribe(todo=>{
      this.getDetails(todo);
    })
  }

  getDetails(todo) {
      this.todoName = todo.name;
      this.todoContent = todo.content;
      this.todoId = todo.id;
      this.todoCreatedOn = todo.createdOn;
      this.todoUpdatedOn = todo.updatedOn;
      this.isEditing = true;
  }

//  To Add note to the list
  addTodo() {
    const todo: Todo = {
      id: Date.now(),
      name: "New Title",
      content: "Sample Content",
      createdOn:new Date(),
      updatedOn:new Date(),
      isCompleted: false
    };

    const list = this.todoStoreService.fetchTodos();
    let duplicate = false;
    list.forEach(ele=> {
      if (ele.name === todo.name && ele.content === todo.content){
        duplicate = true;
      }
    });
// Add New Note Only if New note is not there
    if (!duplicate){
      this.store.dispatch(new TodoActions.AddTodo(todo));
      this.todoStoreService.resetEdit();
    }
  }

  // Edit Note when input changes
  editTodo() {
    const todo: Todo = {
      id: this.todoId,
      name: this.todoName,
      content:this.todoContent,
      createdOn: this.todoCreatedOn,
      updatedOn:new Date(),
      isCompleted: false
    };

    this.store.dispatch(new TodoActions.EditTodo(todo));
  }

  resetEdit(){
    this.isEditing = false;
    this.addTodo();
  }
  todoOnChange() {
    if(this.todoId!=0){
      console.log("admas");
      this.editTodo();
    }
  }
  resetTodo(){
    this.todoName = 'New Title';
    this.todoContent = 'Sample Content';
  this.todoCreatedOn = undefined;
  this.todoUpdatedOn = undefined;
  }

}
