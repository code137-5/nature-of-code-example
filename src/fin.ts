import p5 from "p5";

class Fin {
  p5: p5;
  pos: p5.Vector;
  w: number;
  nextPos: p5.Vector;
  angle: number;

  segMargin: number;
  segFrontW: number;
  segBackW: number;

  constructor(p5: p5, x: number, y: number, size: number) {
    this.p5 = p5;
    this.pos = p5.createVector(x, y);
    this.nextPos = p5.createVector(0, 0);
    this.w = size;
    this.angle = 0;

    this.segMargin = 5;
    this.segFrontW = 20;
    this.segBackW = 10;
  }
  draw() {
    this.p5.circle(this.pos.x, this.pos.y, this.w);
  }
  update(x: number, y: number) {
    // 현재 움직이는 위치와 fin위치간 거리의 차이를 구한다.
    const target = this.p5.createVector(x, y);
    const dir = p5.Vector.sub(target, this.pos);
    dir.setMag(this.w);
    dir.mult(-1);
    // 현재 움직이는 위치가 어디로 향하는지, 각도를 구한다.
    this.angle = dir.heading();

    this.pos = p5.Vector.add(target, dir);

    // this.p5.circle(this.pos.x, this.pos.y, this.w);
    this.plotBody();
  }

  setMargin(a: number) {
    this.segMargin = a;
  }

  setFrontW(a: number) {
    this.segFrontW = a;
  }

  setBackW(a: number) {
    this.segBackW = a;
  }

  // plotSide() {}

  plotBody() {
    // 사다리꼴의 상하 여백 및 앞/뒤 너비 설정
    let margin = this.segMargin;
    let widthFront = this.segFrontW;
    let widthBack = this.segBackW;

    // 현재 위치에서 각도에 따른 이동된 위치 계산
    const arg2 = this.p5.createVector(0, 0);
    const dx = 50 * this.p5.cos(this.angle);
    const dy = 50 * this.p5.sin(this.angle);

    // 현재 위치에서 this.angle 각도로 거리 50 만큼 떨어진 점의 위치를 계산
    arg2.set(this.pos.x + dx, this.pos.y + dy);

    // 사다리꼴의 기본 형태 정의
    let orig = this.p5.createVector(0, 0);
    let other = this.p5.createVector(
      0,
      -this.p5.dist(this.pos.x, this.pos.y, arg2.x, arg2.y) // 아래 방향 기준 사다리꼴의 길이
    );

    let p1, p2, p3, p4;
    p1 = orig.copy(); // 왼쪽 위
    p2 = orig.copy(); // 오른쪽 위
    p3 = other.copy(); // 오른쪽 아래
    p4 = other.copy(); // 왼쪽 아래

    p1.add(-widthFront / 2, margin);
    p2.add(widthFront / 2, margin);
    p3.add(widthBack / 2, -margin);
    p4.add(-widthBack / 2, -margin);

    //  사다리꼴의 네 점을 배열로 저장
    const trapPoints = [p1, p2, p3, p4];

    for (let i = 0; i < trapPoints.length; i++) {
      let h = this.pos.copy();
      // h 벡터는 현재 위치 this.pos와 이동된 위치 arg2 사이의 벡터.두 위치 간의 방향.
      h.sub(arg2);
      //  사다리꼴의 각 점을 h 벡터의 방향으로 회전
      trapPoints[i].rotate(h.heading());
      // 사다리꼴을 90도 회전. 사다리꼴이 h 벡터와 수직으로 배치되도록 하기 위함
      trapPoints[i].rotate(this.p5.radians(90));

      // 회전된 사다리꼴의 각 점을 원래 위치 this.pos로 이동
      trapPoints[i].add(this.pos);
    }

    // 사다리꼴
    this.p5.quad(
      trapPoints[0].x,
      trapPoints[0].y,
      trapPoints[1].x,
      trapPoints[1].y,
      trapPoints[2].x,
      trapPoints[2].y,
      trapPoints[3].x,
      trapPoints[3].y
    );
  }
}

export default Fin;