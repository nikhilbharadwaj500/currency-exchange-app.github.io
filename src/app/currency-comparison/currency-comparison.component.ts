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

  

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.compareCurrencies();
    this.initCurrencyChart();
    this.compareHistoricalTimeSeriesCurrencies();
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
    if(this.baseCurrency && this.targetCurrency)
    {
    this.currency = `${this.baseCurrency}${this.targetCurrency}`; // Concatenate the currencies.
    this.currencyService
      .getExchangeRates(this.currency)
      .subscribe((data: any) => {
        console.log(data); // Log the data received from the API
        this.exchangeRate = data.quotes[0].mid;
       // this.compareHistoricalCurrencies();
        if(this.fromDate && this.toDate)
        {
         this.compareHistoricalTimeSeriesCurrencies();
        }
      });
    }
  }

  compareHistoricalTimeSeriesCurrencies()
  {
    this.currencyService.getHistoricalTimeSeriesExchangeRates(this.currency,this.fromDate,this.toDate,'records').subscribe((data:any)=>{
      console.log(data);//Log the data recieved from the API
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
