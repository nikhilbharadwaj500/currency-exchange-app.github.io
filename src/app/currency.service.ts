import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'https://marketdata.tradermade.com/api/v1/live';
  private historicalApiUrl = "https://marketdata.tradermade.com/api/v1/historical";
  private timeSeriesHistoricalApiUrl = "https://marketdata.tradermade.com/api/v1/timeseries";
  //?currency=UK100,GBPUSD&date=2019-10-09&api_key=Y7AlkyCy9vbtymth9Dgg"
  private date = '2019-10-09';
  constructor(private http: HttpClient) {}
  public apiKey = 'Y7AlkyCy9vbtymth9Dgg';

  getExchangeRates(currency: string) {
    return this.http.get(`${this.apiUrl}?currency=${currency}&api_key=${this.apiKey}`);
  }

  getHistoricalExchangeRates(currency:string)
  {
    return this.http.get(`${this.historicalApiUrl}?currency=${currency}&date=${this.date}&api_key=${this.apiKey}`);
  }

  getHistoricalTimeSeriesExchangeRates(currency:string,startdate: string,enddate: string,format:any)
  {
      //format='records';
      return this.http.get(`${this.timeSeriesHistoricalApiUrl}?currency=${currency}&api_key=${this.apiKey}&start_date=${startdate}&end_date=${enddate}&format=${format}`)
  }

}
