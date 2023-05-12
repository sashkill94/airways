import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ticketsLoadAction } from '../../../../core/store/actions/tickets.actions';
import { Observable } from 'rxjs';
import { selectTicketsLoading } from '../../../../core/store/selectors/tickets.selectors';
import { selectIsRoundTrip } from '../../../../core/store/selectors/order.selectors';
import { selectBookingOrderValidity } from '../../../../core/store/selectors/booking.selectors';

@Component({
  selector: 'airways-flights-page',
  templateUrl: './flights-page.component.html',
  styleUrls: ['./flights-page.component.scss'],
})
export class FlightsPageComponent implements OnInit {
  public isRound$!: Observable<boolean>;

  public areTicketsLoading$!: Observable<boolean>;

  public isOrderValid$!: Observable<boolean>;

  constructor(private router: Router, private store: Store, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.store.dispatch(ticketsLoadAction());
    this.areTicketsLoading$ = this.store.select(selectTicketsLoading);
    this.isRound$ = this.store.select(selectIsRoundTrip);
    this.isOrderValid$ = this.store.select(selectBookingOrderValidity);
  }

  public navigateBack(): void {
    const urlTree = this.router.createUrlTree([''], {
      queryParamsHandling: 'preserve',
      preserveFragment: true,
    });
    this.router.navigateByUrl(urlTree);
  }

  public navigateContinue(): void {
    const urlTree = this.router.createUrlTree(['booking', 'passengers'], {
      queryParamsHandling: 'preserve',
      preserveFragment: true,
    });
    this.router.navigateByUrl(urlTree);
  }
}
