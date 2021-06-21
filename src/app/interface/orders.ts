export interface OrderSchedule {
    flight_number: number,
    departure_city: string,
    arrival_city: string,
    day: number,
    orders?: string,
    index?: number
}

export interface DestinationValue {
    destination: string;
}