import { Component, OnInit } from '@angular/core';
import { SvgIconService } from '../../../../core/services/svg-icon.service';
import { Observable } from 'rxjs';
import { CurrencyFormatType } from '../../../../core/models/formats.models';
import { Store } from '@ngrx/store';
import { selectCurrencyFormat } from '../../../../core/store/selectors/formats.selectors';
import { selectBookingIsRound } from '../../../../core/store/selectors/booking.selectors';

@Component({
  selector: 'airways-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss'],
})
export class SummaryPageComponent implements OnInit {
  public currency$!: Observable<CurrencyFormatType>;

  public isRound$!: Observable<boolean>;

  constructor(private iconsService: SvgIconService, private store: Store) {
    this.iconsService.addSvgIcon('summary');
  }

  ngOnInit(): void {
    this.currency$ = this.store.select(selectCurrencyFormat);
    this.isRound$ = this.store.select(selectBookingIsRound);
  }
}
