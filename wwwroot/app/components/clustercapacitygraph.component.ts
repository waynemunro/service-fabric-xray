﻿import {Component, Input, AfterViewInit, ViewChild, ElementRef} from 'angular2/core';
import {Observable}     from 'rxjs/Rx';
import { ClusterCapacityHistory } from './../models/clustercapacityhistory';
import {Color} from './../color';

declare var Chart: any;

export class DataStream {
    public constructor(
        public name: string,
        public stream: Observable<ClusterCapacityHistory[]>)
    { }
}

@Component({
    selector: 'cluster-capacity-graph',
    templateUrl: 'app/components/clustercapacitygraph.component.html',
    styleUrls: ['app/components/clustercapacitygraph.component.css']
})
export class ClusterCapacityGraph implements AfterViewInit {

    @ViewChild("chartCanvas")
    private chartCanvasElement: ElementRef;

    @Input()
    private capacityHistory: Observable<DataStream>;

    private chart: any;

    public constructor() {
    }

    public ngAfterViewInit(): void {
        this.chart = new Chart(this.chartCanvasElement.nativeElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: "#333333",
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: "#333333",
                        }
                    }]
                }
            }
        });

        this.capacityHistory.subscribe(
            dataStream => {

                if (!dataStream) {
                    return;
                }

                console.log("received stream for " + dataStream.name);

                dataStream.stream.subscribe(
                    next => {
                        console.log("received data for " + dataStream.name + ". Count: " + next.length);
                        this.addData(dataStream.name, next);
                    },
                    error => {
                        // this.removeData(dataStream.name);
                    },
                    () => {
                        //this.removeData(dataStream.name);
                    }
                );
            },
            error => {
                console.log("error: " + error);
            },
            () => {
                console.log("complete");
            }
        );
    }

    private removeData(label: string) {
        let ix = this.chart.config.data.datasets.findIndex(x => x.label == label);

        if (ix >= 0) {
            this.chart.config.data.datasets.splice(ix, 1);
        }

        this.chart.update();
    }

    private addData(name: string, data: ClusterCapacityHistory[]): void {

        let dataset = this.chart.config.data.datasets.find(x => x.label == name);

        if (!dataset) {

            let ix = this.chart.config.data.datasets.length;

            let h = 196;
            let s = (35 - ((ix % 6) * 5));
            let v = (70 - ((ix % 6) * 10));

            let fillColor: Color = Color.fromHSV(h, s, v);
            let highlightColor: Color = Color.fromHSV(h, s, 100);

            dataset = {
                label: name,
                lineTension: 0.2,
                borderColor: fillColor.toRBGAString(1),
                pointBorderColor: fillColor.toRBGAString(1),
                backgroundColor: fillColor.toRBGAString(0.2),
                pointBackgroundColor: fillColor.toRBGAString(0.2),
                pointRadius: 1,
                pointHoverRadius: 2,
                pointHitRadius: 15,
                pointHoverBorderColor: "rgba(255, 255, 255, 1)",
                pointHoverBackgroundColor: fillColor.toRBGAString(1),
                borderWidth: 1,
                data: []
            };

            this.chart.config.data.datasets.push(dataset);
        }

        for (var item of data) {

            if (!this.chart.config.data.labels.find(x => x == item.timestamp.toLocaleString())) {
                this.chart.config.data.labels.push(item.timestamp.toLocaleString());
            }

            dataset.data.push(item.data);
        }

        this.chart.update();
    }
}