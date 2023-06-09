import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsPageComponent } from './pages/flights-page/flights-page.component';
import { PassengersPageComponent } from './pages/passengers-page/passengers-page.component';
import { SummaryPageComponent } from './pages/summary-page/summary-page.component';
import { BookingRoutingModule } from './booking-routing.module';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { FlightInfoComponent } from './components/flight-info/flight-info.component';
import { FlightTimeComponent } from './components/flight-time/flight-time.component';
import { WayComponent } from './components/way/way.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CarouselModule } from 'primeng/carousel';
import { StoreModule } from '@ngrx/store';
import { ticketsReducer } from '../../core/store/reducers/tickets.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TicketsEffect } from '../../core/store/effects/tickets.effect';
import { SeatsColorDirective } from './directives/seats-color.directive';
import { BottomButtonsComponent } from './components/bottom-buttons/bottom-buttons.component';
import { bookingReducer } from '../../core/store/reducers/booking.reducer';
import { PassengerCardComponent } from './components/passenger-card/passenger-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { SharedModule } from '../../modules/shared/shared.module';

@NgModule({
  declarations: [
    FlightsPageComponent,
    PassengersPageComponent,
    SummaryPageComponent,
    FlightInfoComponent,
    FlightTimeComponent,
    WayComponent,
    CalendarComponent,
    SeatsColorDirective,
    BottomButtonsComponent,
    PassengerCardComponent,
    ContactDetailsComponent,
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    MaterialDesignModule,
    CarouselModule,
    StoreModule.forFeature('tickets', ticketsReducer),
    StoreModule.forFeature('booking', bookingReducer),
    EffectsModule.forFeature([TicketsEffect]),
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class BookingModule {}
