// currency-comparison.component.ts
import { Component,OnInit } from '@angular/core';

import { CurrencyService } from '../currency.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexYAxis,
  ApexNoData
} from "ng-apexcharts";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  legend: ApexLegend;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  noData: ApexNoData;
};

@Component({
  selector: 'app-currency-comparison',
  templateUrl: './currency-comparison.component.html',
  styleUrls: ['./currency-comparison.component.css'],
})
export class CurrencyComparisonComponent implements OnInit {

  currencyForm: FormGroup=new FormGroup({});;

  baseCurrency: string = '';
  targetCurrency: string = '';
  currency: string = '';
  exchangeRate: string = '';
  timeSeriesExchangeRate: number[] = [];
  dateTimeSeriesExchangeRate: string[] = [];
  fromDate: string = '';
  toDate: string = '';
  currencyChartOptions? : Partial<ChartOptions> | any;
  showChart : boolean = false;
  // Define an array of available currencies
  currencies: string[] = [
    'AED', 'ALL', 'AOA', 'JPY', 'ARS', 'AUD', 'BDT', 'BGN', 'BHD', 'BRL','CAD','CHF','CLP','CNH','CNY','COP','CZK','DKK','EGP','EUR','GBP','GHS','HKD','HRK','HUF','IDR','ILS','INR','ISK','JOD','JPY','KES','KRW','KWD','LBP','LKR','MAD','MUR','MXN','MYR','NGN','NOK','NZD','OMR','PEN','PHP','PKR','PLN','QAR','RON','RUB','SAR','SEK','SGD','THB','TND','TRY','TWD','USD','VND','XAF','XAG','XAU','XOF','XPD','XPT','ZAR','ZWL',
  ];

  constructor(private currencyService: CurrencyService,private formBuilder: FormBuilder) {
    
  }

  ngOnInit() {
    this.currencyForm = this.formBuilder.group({
      baseCurrency: [this.baseCurrency, Validators.required],
      targetCurrency: [this.targetCurrency, Validators.required],
      fromDate:[this.fromDate],
      endDate:[this.toDate]
    });
    this.compareCurrencies();
    this.initCurrencyChart();
  //this.compareHistoricalTimeSeriesCurrencies();
  }

  initCurrencyChart()
  {
    this.currencyChartOptions = {
      series: [
      ],
      chart: {
        stacked: false,
        animations:{
          enabled: false
        },
        height:250,
        width: "100%",
        type: "line"
      },
      stroke: {
        width: [4, 4]
      },
      plotOptions: {
        bar: {
          columnWidth: "20%"
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      },
      grid: {
        xaxis:{
          lines:{
            show:true,
          },
        },
        yaxis: {
          lines:{
            show:true
          }
        },
        strokeDashArray: 10
      },
      tootip: {
        enabled: true,
        shared: true
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: "9px",
        }
      },
      xaxis : {
        categories:[],
      },
      yaxis:{},
      noData: {
        text: "Insufficient data",
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined
        }
      }
    }
  }

  compareCurrencies() {
    if(this.currencyForm.value.baseCurrency && this.currencyForm.value.targetCurrency)
    {
    this.currency = `${this.currencyForm.value.baseCurrency}${this.currencyForm.value.targetCurrency}`; // Concatenate the currencies.
    this.currencyService
      .getExchangeRates(this.currency)
      .subscribe((data: any) => {
        console.log(data); // Log the data received from the API
        this.exchangeRate = data.quotes[0].mid;
        if(this.currencyForm.value.fromDate && this.currencyForm.value.endDate)
        {
         this.compareHistoricalTimeSeriesCurrencies();
        }
      });
    }
  }

  compareHistoricalTimeSeriesCurrencies()
  {
    this.currencyService.getHistoricalTimeSeriesExchangeRates(this.currency,this.currencyForm.value.fromDate,this.currencyForm.value.endDate,'records').subscribe((data:any)=>{
      console.log(data);//Log the data recieved from the API
      this.timeSeriesExchangeRate =[];
      this.dateTimeSeriesExchangeRate=[];
      for(let i = 0;i<data.quotes.length;i++) { 
        console.log(data.quotes[i]);
        this.timeSeriesExchangeRate[i] = data.quotes[i].close;
        this.dateTimeSeriesExchangeRate[i] = data.quotes[i].date;
     }
     this.frameCurrencyChart(data);
    })
  }
  
  frameCurrencyChart(result: string[] | any){
    //console.log(result)
    if(!!result){
      this.showChart=true;
      let ratesList = [];
      let datesList = [];
      for(let i=0;i<this.timeSeriesExchangeRate.length;i++){
        ratesList.push(this.timeSeriesExchangeRate[i]);
        datesList.push(this.dateTimeSeriesExchangeRate[i]);
      }
       console.log(ratesList);
      let currencyChartSeriesData = [{
        name: 'Exchange Rate',
        data: ratesList,
        color: '#FF6542'
      }];
      console.log(currencyChartSeriesData);
      this.currencyChartOptions.series = Object.assign([],currencyChartSeriesData);
      // this.buildMetricChartOptions.series;
      this.currencyChartOptions.xaxis = {
        title: {
          style: {
            color: '#000',
            fontWeight: 700
          }
        },
        categories: Object.assign([],datesList),
        position: "bottom",
        labels: {
          show: true,
          style: {
            fontSize: "12px",
            colors: "#000"
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
      };
    }
  }

}
