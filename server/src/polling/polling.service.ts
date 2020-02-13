import { HttpService, Injectable } from '@nestjs/common';
import { Observable, timer } from 'rxjs';
import { flatMap, distinctUntilChanged, pluck, mapTo } from 'rxjs/operators';
import { isEqual } from 'lodash';

export interface PollingConfig {
    endpoint: string;
    interval: number;
}

@Injectable()
export class PollingService {
    constructor(private readonly httpService: HttpService) {}

    poll<ResponseType>({
        endpoint,
        interval,
    }: PollingConfig): Observable<ResponseType> {
        return timer(0, interval).pipe(
            mapTo(endpoint),
            flatMap(url => this.httpService.get<ResponseType>(url)),
            pluck('data'),
            distinctUntilChanged(isEqual),
        );
    }
}
