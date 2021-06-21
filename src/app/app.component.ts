import { AppServicesService } from './services/app-services.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DestinationValue, OrderSchedule } from './interface/orders';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    toggleBtnTxt: string = 'VIEW ORDER SCHEDULE';

    toggleBtnBool: boolean = false;

    flightScheduleOrderCombine: OrderSchedule[] =[];
    orderFlightInfo: OrderSchedule[] = [];
    fetchOrderFlightKeys: any = [];

    flightSchedule: any = {};

    ObjectKeys = Object.keys;
    ObjectValue = Object.values;

    constructor (private http: HttpClient, private orderServices: AppServicesService ) {

    }

    ngOnInit(): void {
        this.getOrderScheduleFlightInfo();
    }
    
    getOrderScheduleFlightInfo() {
        let orderFlightInfo = this.orderServices.getOrderInfo();

        orderFlightInfo.subscribe(  (data) => {
            this.orderFlightInfo = [...data.outMap1];
            this.flightSchedule = { ...data.outMap2 };

            this.fetchOrderFlightKeys = [...this.listenChangesFlightInfo(of(data.outMap1))];

            this.flightScheduleOrderCombine = [...this.listenFlightSchedule(of(data.outMap1), of( data.outMap2 ) )];
        })
    }

    listenChangesFlightInfo ( data:Observable<OrderSchedule[]> ) {
        let fetchingOrders: any = [];
        data.subscribe( resp => {
            var groupedByData = this.groupByKey(resp, 'day');
            (Object.keys(groupedByData)).forEach(x => {                
                fetchingOrders.push({
                    [`day ${x}`]: groupedByData[x]
                })
            })
        });
        return fetchingOrders;
    }

    listenFlightSchedule(flightInfObs: Observable<OrderSchedule[]>, flightScheduleObs:Observable<any> ):OrderSchedule[] {
        let flightInfo = [...this.listenChangesFlightInfo( flightInfObs )];
        let overallFlightSchedule: OrderSchedule[] = [];
        flightScheduleObs.subscribe( data => {
            let dataValue: DestinationValue[] = Object.values(data);
            let dataKey = Object.keys(data);

            flightInfo.forEach((element: any) => {
                Object.values(element).forEach( ( element1:any ) => {
                    element1.forEach( ( individualFlight:OrderSchedule ) => {
                        dataValue.forEach( (value:DestinationValue, indx: number) => {
                            if ( value.destination === individualFlight.arrival_city ) {
                                overallFlightSchedule.push({
                                    flight_number: individualFlight.flight_number,
                                    departure_city: individualFlight.departure_city,
                                    arrival_city: individualFlight.arrival_city,
                                    day: individualFlight.day,
                                    orders: dataKey[indx],
                                    index: indx
                                });
                            }
                        });
                    });
                });    
            });
        });
        return overallFlightSchedule;
    }

    groupByKey(data: OrderSchedule[], key:string) {
        return data.reduce(function (rv: any, x: any) {
            ( rv[x[key]] = rv[x[key]] || [] ).push(x);
            return rv;
        }, {});
    };

    viewOrderASchedule() {
        this.toggleBtnBool = !this.toggleBtnBool;
        this.toggleBtnBool ? this.toggleBtnTxt = 'VIEW FLIGHT SCHEDULE' : this.toggleBtnTxt = 'VIEW ORDER SCHEDULE'
    }
}
