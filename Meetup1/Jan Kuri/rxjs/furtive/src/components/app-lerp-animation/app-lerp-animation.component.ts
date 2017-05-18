import { Component, ElementRef, OnInit, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';

export interface MoveEvent {
  x: number;
  y: number;
}

@Component({
  selector: 'app-lerp-animation',
  templateUrl: 'app-lerp-animation.component.html'
})
export class AppLerpAnimationComponent implements OnInit {
  docEl: HTMLElement;
  ccEl: HTMLElement;
  mouseMove: Observable<MoveEvent>;
  touchMove: Observable<MoveEvent>;
  move: Observable<MoveEvent>;
  rotX: number;
  rotY: number;

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.docEl = document.documentElement;
    this.ccEl = this.elementRef.nativeElement.querySelector('.credit-card');
    const { clientWidth, clientHeight } = this.docEl;

    this.mouseMove = Observable.fromEvent(this.docEl, 'mousemove')
      .map((event: MouseEvent) => ({ x: event.clientX, y: event.clientX }));


    this.touchMove = Observable.fromEvent(this.docEl, 'touchmove')
      .map((event: TouchEvent) => ({ x: event.touches[0].clientX, y: event.touches[0].clientY }));

    this.move = Observable.merge(...[this.mouseMove, this.touchMove]);

    this.move.subscribe(pos => {
      this.rotX = (pos.y / clientHeight * -50) + 25;
      this.rotY = (pos.x / clientWidth * 50) - 25;

      this.renderer
        .setElementStyle(this.ccEl, 'transform', `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`);
    });
  }

  lerp(start: MoveEvent, end: MoveEvent): MoveEvent {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    return {
      x: start.x + dx * 0.1,
      y: start.y + dy * 0.1
    };
  }
}
