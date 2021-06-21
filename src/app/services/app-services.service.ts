import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderSchedule } from '../interface/orders';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  	providedIn: 'root'
})
export class AppServicesService {

	constructor( private http: HttpClient ) { 
		
	}

	getOrderInfo () {
		let map1 = this.http.get<OrderSchedule[]>('assets/json-files/coding-assignment-schedule.json');
		let map2 = this.http.get<any>('assets/json-files/coding-assigment-orders.json');

		return map1.pipe(
			mergeMap( (outMap1) => {
				return map2.pipe(
					map( outMap2 => {
						return { outMap1, outMap2 }
					})
				)
			})
		)
    }
}
