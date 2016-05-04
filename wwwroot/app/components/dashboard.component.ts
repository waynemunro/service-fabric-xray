﻿import {Component, Inject} from 'angular2/core';
import {Router} from 'angular2/router';
import {ClusterComponent} from './cluster.component';
import {DataService} from './../services/data.service';

@Component({
    selector: 'dashboard-component',
    templateUrl: 'app/components/dashboard.component.html',
    styleUrls: ['app/components/dashboard.component.css'],
    directives: [ClusterComponent]
})

export class DashboardComponent {

    constructor(
        private dataService: DataService,
        private router: Router)
    { }

    toggleExpand() {

    }
}