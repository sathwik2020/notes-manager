import { Component, OnInit, OnDestroy, Output, EventEmitter  } from '@angular/core';
import { TodoService } from '../services/todo-store.service';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '../models/todo-model';

import * as TodoActions from '../store/todo.actions';
import { TodosState } from '../store/todo.state';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  @Output() selectNote = new EventEmitter<Todo>();

  todosState$: Observable<TodosState>;
  noteFilter: any;
  // selectedNote: Todo;
  selectedNote: Todo = TodoService.addedNoteId;

  constructor(private todoStoreService: TodoService, private store: Store<TodosState>) {

    this.todosState$ = this.store.select('todosState');



  }

  ngOnInit() {
    this.store.dispatch(new TodoActions.LoadTodos());
  }

  ngAfterViewInit() {
    this.selectedNote = this.todoStoreService.fetchTodos()[this.todoStoreService.fetchTodos().length -1];
    this.todoStoreService.selectedTodo.subscribe(res => {
      if (res) {
        this.selectedNote =res;
      }
    })
    
    // console.log('from after view init:'+this.selectedNote)
  }


  fetchTodos() {
    // this.todos = this.todoStoreService.fetchTodos();
  }

  deleteTodo(todo: Todo) {
    // this.todoStoreService.deleteTodo(todo);
    // this.fetchTodos();
    this.store.dispatch(new TodoActions.DeleteTodo(todo));
    this.selectTodo(this.todoStoreService.fetchTodos()[this.todoStoreService.fetchTodos().length -1]);
  }
  selectTodo(todo:Todo){
    this.todoStoreService.selectTodo(todo);
    this.selectedNote = todo;
  }

  toggleTodo(todo: Todo) {
    this.store.dispatch(new TodoActions.ToggleTodo(todo));
  }

  ngOnDestroy() {
  }

}
