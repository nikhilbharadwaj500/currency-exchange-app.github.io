import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComparisonComponent } from './currency-comparison/currency-comparison.component';
import { ExchangeRateGraphComponent } from './exchange-rate-graph/exchange-rate-graph.component';

const routes: Routes = [
  
  { path: 'comparison', component: CurrencyComparisonComponent }
  //{ path: 'graph', component: ExchangeRateGraphComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
