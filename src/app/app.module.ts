import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgApexchartsModule} from "ng-apexcharts";
import { CurrencyComparisonComponent } from './currency-comparison/currency-comparison.component';
import { ExchangeRateGraphComponent } from './exchange-rate-graph/exchange-rate-graph.component';
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyComparisonComponent,
    ExchangeRateGraphComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule,ReactiveFormsModule,NgApexchartsModule,MatDatepickerModule,MatInputModule,
    MatButtonModule,
    MatFormFieldModule,],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
