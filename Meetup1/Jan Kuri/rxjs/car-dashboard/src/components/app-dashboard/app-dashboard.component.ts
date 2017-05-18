import { Component, OnInit, ElementRef } from '@angular/core';
import { RenderService } from '../../services/render.service';
import { EngineService } from '../../services/engine.service';
import 'rxjs/add/operator/throttleTime';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private render: RenderService,
    private engineService: EngineService
  ) { }

  ngOnInit() {
    let rpmElement = this.elementRef.nativeElement.querySelector('.rpmGauge');
    let speedElement = this.elementRef.nativeElement.querySelector('.speedGauge');

    this.render.renderRpmGauge(rpmElement);
    this.render.renderSpeedGauge(speedElement);
    let perc = 0;

    this.engineService.engine
      .throttleTime(300)
      .subscribe(accelerate => {
        if (accelerate && perc < 100) {
          perc += 10;
          this.render.setRpmValue(10000 / 100 * perc, 300);
          this.render.setSpeedValue(320 / 100 * perc, 300);
        } else if (!accelerate && perc > 0) {
          perc -= 10;
          this.render.setRpmValue(10000 / 100 * perc, 300);
          this.render.setSpeedValue(320 / 100 * perc, 300);
        }
      });
  }
}
