import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateCartAction } from './core/store/actions/cart.actions';
import { updateHistoryAction } from './core/store/actions/user.actions';

@Component({
  selector: 'airways-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'airways';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(updateCartAction());
    this.store.dispatch(updateHistoryAction());
  }
}
