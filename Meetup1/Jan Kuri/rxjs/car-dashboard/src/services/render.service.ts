import { Injectable, Provider } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class RenderService {
  svgRpm: d3.Selection<d3.BaseType, any, any, any>;
  rpmNeedle: d3.Selection<d3.BaseType, any, any, any>;
  svgSpeed: d3.Selection<d3.BaseType, any, any, any>;
  speedNeedle: d3.Selection<d3.BaseType, any, any, any>;

  ///////////////////////////
  // RPM Gauge
  ///////////////////////////
  renderRpmGauge(el: HTMLElement): void {
    let w = el.clientWidth;
    let h = w;
    let r = w / 2;

    let degToRad = (deg: number) => deg * Math.PI / 180;
    let scale = d3.scaleLinear().range([0, 1]).domain([0, 100]);

    let ticksData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce((acc, curr) => {
      if (curr === 0 || curr === 100) {
        if (curr === 100) {
          acc.push(100);
          return acc;
        } else {
          return acc;
        }
      } else {
        return acc.concat(d3.range(curr - 10, curr + 10));
      }
    }, []);

    this.svgRpm = d3.select(el).append('svg').attr('width', w).attr('height', h);
    let g = this.svgRpm.append('g').attr('transform', `translate(${w / 2}, ${h / 2})`);

    // defs
    let defs = this.svgRpm.append('defs');

    // glow
    let glowFilter = defs.append('filter')
      .attr('id', 'glow');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', 3.5)
      .attr('result', 'coloredBlur');

    let feMerge = glowFilter.append('feMerge');

    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');

    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // gradient
    let gradient = defs.append('linearGradient')
      .attr('id', 'whiteGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#D6D7D8')
      .attr('stop-opacity', 1);
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#FFFFFF')
      .attr('stop-opacity', 0.3);

    // main arc
    let outerRadius = w / 2 - 10;
    let innerRadius = 0;

    let arc: d3.Arc<any, any> = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('d', arc)
      .attr('fill', 'url(#whiteGradient)')
      .attr('stroke', '#c92a2a')
      .attr('stroke-width', 7);

    // ticks
    let lg = this.svgRpm.append('g')
      .attr('class', 'label')
      .attr('transform', `translate(${r}, ${r})`);
    let minAngle = -140;
    let maxAngle = 140;
    let range = maxAngle - minAngle;

    lg.selectAll('line')
      .data(ticksData)
      .enter().append('line')
      .attr('class', 'tickline')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', (d: any) => d % 10 === 0 ? 13 : 10)
      .attr('transform', (d: any) => {
        let ratio = scale(d);
        let newAngle = minAngle + (ratio * range);
        let deviation = 14;
        return `rotate(${newAngle}) translate(0, ${deviation - r})`;
      })
      .attr('stroke', '#333333')
      .attr('stroke-width', (d: any) => {
        return 3;
      });

    // ticks text
    lg.selectAll('text')
      .data(ticksData)
      .enter().append('text')
      .attr('transform', (d: any) => {
        let ratio = scale(d);
        let newAngle = degToRad(minAngle + (ratio * range));
        let y = (55 - r) * Math.cos(newAngle);
        let x = -1 * (52 - r) * Math.sin(newAngle);
        return `translate(${x}, ${y + 7})`;
      })
      .text((d: any) => d % 10 === 0 ? d / 10 : '')
      .attr('fill', '#333333')
      .attr('font-size', '30')
      .attr('text-anchor', 'middle');

    // needle and needle arc
    let pointerHeadLength = r * 0.85;
    let lineData  = [
      [ 0, -pointerHeadLength ],
      [ 0, 30 ],
    ];
    let needleLine = d3.line();
    let ng = this.svgRpm.append('g')
      .data([lineData])
      .attr('class', 'pointer')
      .attr('stroke', '#c92a2a')
      .attr('stroke-width', '10')
      .attr('stroke-linecap', 'round')
      .attr('transform', `translate(${r}, ${r})`)
      .attr('z-index', '1')
      .attr('filter', 'url(#glow)');

    outerRadius = 20;
    innerRadius = 0;

    let needleArc: d3.Arc<any, any> = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    ng.append('path')
      .attr('d', needleArc)
      .attr('fill', '#1F2E2B')
      .attr('stroke', 'transparent');

    this.rpmNeedle = ng.append('path')
      .attr('d', needleLine)
      .attr('transform', `rotate(${-140})`);
  }

  setRpmValue(rpm: number, duration = 50) {
    if (!this.rpmNeedle) {
      return;
    }

    let minAngle = -140;
    let maxAngle = 140;
    let range = maxAngle - minAngle;
    let scale = d3.scaleLinear().range([0, 1]).domain([0, 10000]);
    let angle = minAngle + (scale(rpm) * range);

    this.rpmNeedle.transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('transform', `rotate(${angle})`);
  }

  ///////////////////////////
  // Speed Gauge
  ///////////////////////////
  renderSpeedGauge(el: HTMLElement): void {
    let w = el.clientWidth;
    let h = w;
    let r = w / 2;

    let degToRad = (deg: number) => deg * Math.PI / 180;
    let scale = d3.scaleLinear().range([0, 1]).domain([0, 340]);

    let ticksData = [
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
      120, 140, 160, 180, 200, 220, 240, 260, 280,
      300, 320, 340
    ].reduce((acc, curr) => {
      if (curr === 0 || curr === 340) {
        return acc;
      } else {
        return acc.concat(d3.range(curr - 10, curr + 10));
      }
    }, []).reduce((acc, curr) => {
      if (curr % 5 === 0) {
        return acc.concat(curr);
      } else {
        return acc;
      }
    }, []);

    this.svgSpeed = d3.select(el).append('svg').attr('width', w).attr('height', h);
    let g = this.svgSpeed.append('g').attr('transform', `translate(${w / 2}, ${h / 2})`);

    // defs
    let defs = this.svgSpeed.append('defs');

    // glow
    let glowFilter = defs.append('filter')
      .attr('id', 'glow');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', 3.5)
      .attr('result', 'coloredBlur');

    let feMerge = glowFilter.append('feMerge');

    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');

    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // gradient
    let gradient = defs.append('linearGradient')
      .attr('id', 'whiteGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#D6D7D8')
      .attr('stop-opacity', 1);
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#FFFFFF')
      .attr('stop-opacity', 0.3);

    // main arc
    let outerRadius = w / 2 - 10;
    let innerRadius = 0;

    let arc: d3.Arc<any, any> = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('d', arc)
      .attr('fill', 'url(#whiteGradient)')
      .attr('stroke', '#c92a2a')
      .attr('stroke-width', 7);

    // ticks
    let lg = this.svgSpeed.append('g')
      .attr('class', 'label')
      .attr('transform', `translate(${r}, ${r})`);
    let minAngle = -140;
    let maxAngle = 140;
    let range = maxAngle - minAngle;

    lg.selectAll('line')
      .data(ticksData)
      .enter().append('line')
      .attr('class', 'tickline')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', (d: any) => d % 10 === 0 ? 13 : 10)
      .attr('transform', (d: any) => {
        let ratio = scale(d);
        let newAngle = minAngle + (ratio * range);
        let deviation = 14;
        return `rotate(${newAngle}) translate(0, ${deviation - r})`;
      })
      .attr('stroke', '#333333')
      .attr('stroke-width', (d: any) => {
        return 3;
      });

    // ticks text
    lg.selectAll('text')
      .data(ticksData)
      .enter().append('text')
      .attr('transform', (d: any) => {
        let ratio = scale(d);
        let newAngle = degToRad(minAngle + (ratio * range));
        let y = (55 - r) * Math.cos(newAngle);
        let x = -1 * (55 - r) * Math.sin(newAngle);
        return `translate(${x}, ${y + 7})`;
      })
      .text((d: any) => d % 20 === 0 ? d : '')
      .attr('fill', '#333333')
      .attr('font-size', '24')
      .attr('text-anchor', 'middle');

    // needle and needle arc
    let pointerHeadLength = r * 0.85;
    let lineData  = [
      [ 0, -pointerHeadLength ],
      [ 0, 30 ],
    ];
    let needleLine = d3.line();
    let ng = this.svgSpeed.append('g')
      .data([lineData])
      .attr('class', 'pointer')
      .attr('stroke', '#c92a2a')
      .attr('stroke-width', '10')
      .attr('stroke-linecap', 'round')
      .attr('transform', `translate(${r}, ${r})`)
      .attr('z-index', '1')
      .attr('filter', 'url(#glow)');

    outerRadius = 20;
    innerRadius = 0;

    let needleArc: d3.Arc<any, any> = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    ng.append('path')
      .attr('d', needleArc)
      .attr('fill', '#1F2E2B')
      .attr('stroke', 'transparent');

    this.speedNeedle = ng.append('path')
      .attr('d', needleLine)
      .attr('transform', `rotate(${-140})`);
  }

  setSpeedValue(speed: number, duration = 50) {
    if (!this.speedNeedle) {
      return;
    }

    let minAngle = -140;
    let maxAngle = 140;
    let range = maxAngle - minAngle;
    let scale = d3.scaleLinear().range([0, 1]).domain([0, 320]);
    let angle = minAngle + (scale(speed) * range);

    this.speedNeedle.transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('transform', `rotate(${angle})`);
  }

}

export const RenderServiceProvider: Provider = {
  provide: RenderService, useClass: RenderService
};
