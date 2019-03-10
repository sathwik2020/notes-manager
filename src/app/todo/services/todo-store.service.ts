import { Injectable } from '@angular/core';
import { Todo } from '../models/todo-model';
import { Subject } from 'rxjs';

@Injectable()
export class TodoService {

  public static addedNoteId :Todo;

  selectedTodo = new Subject<Todo>();
  constructor() {
    if (this.isStoreEmpty()) {
      console.log("its empty");
      this.setTodosIntoStore([{"id": Date.now(),"name":"New Title","content":"Sample Content","createdOn": new Date(),"updatedOn":undefined,"isCompleted":true}]);
    }
  }

  private getTodosFromStore() {

    return JSON.parse(localStorage.getItem('todos'));
  }

  private setTodosIntoStore(todos: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  private isStoreEmpty() {
    const todos: Todo[] = this.getTodosFromStore();
    if (!todos) {
      return true;
    } else if(todos && todos.length == 0){
      return true;
    }
    return false;
  }

  public addTodo(todo: Todo) {
    const todos: Todo[] = this.getTodosFromStore();
    if (!todos) {
      this.setTodosIntoStore([todo]);
      this.resetEdit();
    } else {
      todos.push(todo);
      this.setTodosIntoStore(todos);
      this.selectTodo(todo);
    }
  }

  public fetchTodos(): Todo[] {
    console.log(this.isStoreEmpty());
    if (this.isStoreEmpty()) {
      console.log("its empty");
      this.setTodosIntoStore([{"id": Date.now(),"name":"New Title","content":"Sample Content","createdOn": new Date(),"updatedOn":undefined,"isCompleted":true}]);
    }
    const todos: Todo[] = this.getTodosFromStore();
    return todos;
  }

  public deleteTodo(todo: Todo) {
    let todos: Todo[] = this.getTodosFromStore();
    todos = todos.filter(storeTodo => storeTodo.id !== todo.id);
    this.setTodosIntoStore(todos);
    this.resetEdit();
  }

  public selectTodo(todo: Todo){
    this.selectedTodo.next(todo);

  }

  public editTodo(todo: Todo) {
    const todos: Todo[] = this.getTodosFromStore();
    const filteredTodo: Todo = todos.filter(todoItem => todoItem.id === todo.id)[0];
    filteredTodo.name = todo.name;
    filteredTodo.content = todo.content;
    filteredTodo.updatedOn = new Date;
    this.setTodosIntoStore(todos);
  }
public resetEdit(){

  this.selectedTodo.next(this.getTodosFromStore()[this.getTodosFromStore().length-1]);
}
  public toggleTodo(todo: Todo): void {
    const todos: Todo[] = this.getTodosFromStore();
    const filteredTodo: Todo = todos.filter(todoItem => todoItem.id === todo.id)[0];
    filteredTodo.isCompleted = todo.isCompleted;
    this.setTodosIntoStore(todos);
  }

}
