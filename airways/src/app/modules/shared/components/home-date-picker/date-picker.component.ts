import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Store } from '@ngrx/store';
import moment, { Moment } from 'moment';
import { filter, Subscription } from 'rxjs';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants/formats.constants';
import { MaterialDateFormatInterface } from 'src/app/core/models/material-date-format.model';
import { updateOrderDateAction } from 'src/app/core/store/actions/order.actions';
import { selectDateFormatInUppercase } from 'src/app/core/store/selectors/formats.selectors';
import {
  selectArrivalDate,
  selectDepartureDate,
  selectIsRoundTrip,
} from 'src/app/core/store/selectors/order.selectors';
import { AppStateInterface } from 'src/app/core/store/store.models';

@Component({
  selector: 'airways-date-picker',
  templateUrl: './date-picker.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: DEFAULT_DATE_FORMAT },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class DatePickerComponent implements OnInit, OnDestroy {
  departure = new FormControl<Moment | null>(null, [Validators.required]);

  arrival = new FormControl<Moment | null>(null, [Validators.required]);

  minDate = new Date();

  isRound = true;

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DATE_FORMATS) private dateFormats: MaterialDateFormatInterface,
    private parentForm: FormGroupDirective,
    private store: Store<AppStateInterface>,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /* eslint-disable @ngrx/no-store-subscription */
  initializeListeners() {
    const departureListener = this.store
      .select(selectDepartureDate)
      .pipe(filter(Boolean))
      .subscribe((date) => this.departure.setValue(moment(date)));
    const arrivalListener = this.store
      .select(selectArrivalDate)
      .pipe(filter(Boolean))
      .subscribe((date) => this.arrival.setValue(moment(date)));
    const formatListener = this.store
      .select(selectDateFormatInUppercase)
      .pipe(filter(Boolean))
      .subscribe((format) => {
        this.dateFormats.display.dateInput = format;
        this.dateFormats.parse.dateInput = format;
        this.updateDateFormsFormat();
      });
    const typeListener = this.store.select(selectIsRoundTrip).subscribe((type) => {
      this.isRound = type;
      this.toggleValidation(type);
    });
    this.subscriptions.push(departureListener, arrivalListener, formatListener, typeListener);
  }
  /* eslint-enable @ngrx/no-store-subscription */

  initializeForm() {
    this.parentForm.form.addControl('departure', this.departure);
    this.parentForm.form.addControl('arrival', this.arrival);
  }

  toggleValidation(type: boolean): void {
    if (type) {
      this.arrival.setValidators([Validators.required]);
    } else {
      this.arrival.removeValidators([Validators.required]);
      this.arrival.setErrors(null);
      this.arrival.setValue(null);
    }
  }

  updateDateFormsFormat() {
    const departure = this.departure.value;
    const arrival = this.arrival.value;
    this.departure.setValue(departure);
    this.arrival.setValue(arrival);
  }

  onDepartureDateChange() {
    if (!this.departure.value) return;
    this.store.dispatch(
      updateOrderDateAction({
        param: 'departure',
        data: this.departure.value?.toISOString(),
      }),
    );
  }

  onArrivalDateChange() {
    if (!this.arrival.value) return;
    this.store.dispatch(
      updateOrderDateAction({
        param: 'arrival',
        data: this.arrival.value?.toISOString(),
      }),
    );
  }
}
