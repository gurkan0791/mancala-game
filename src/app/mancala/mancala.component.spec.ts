import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MancalaComponent } from './mancala.component';
import { User, Hole, Position } from '../core'

describe('MancalaComponent', () => {
  let component: MancalaComponent;
  let fixture: ComponentFixture<MancalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MancalaComponent]
    })
      .compileComponents();
  });

  var user1: User = { holes: [{ piece: 4 }, { piece: 4 }, { piece: 4 }, { piece: 4 }], id: "1", name: "user1", position: "up", store: 0 };
  var user2: User = { holes: [{ piece: 4 }, { piece: 4 }, { piece: 4 }, { piece: 4 }], id: "2", name: "user2", position: "up", store: 0 };

  beforeEach(() => {
    fixture = TestBed.createComponent(MancalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Mancala Game'`, () => {
    const fixture = TestBed.createComponent(MancalaComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Mancala Game');
  });

  it(`should have as isGameOver 'false'`, () => {
    const fixture = TestBed.createComponent(MancalaComponent);
    const app = fixture.componentInstance;
    expect(app.isGameOver).toBe(false);
  });

  it(`should called startNewGame when app initialize`, () => {
    const fixture = TestBed.createComponent(MancalaComponent);
    const app = fixture.componentInstance;
    spyOn(app, "startNewGame");
    app.ngOnInit();
    expect(app.startNewGame).toHaveBeenCalled();
  });

  it(`test startNewGame() method`, () => {
    const fixture = TestBed.createComponent(MancalaComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(app.isGameOver).toBe(false);
    expect(app.turn).not.toBeUndefined();
  });

  it(`should initialize players`, () => {
    const fixture = TestBed.createComponent(MancalaComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect([app.user1.id, app.user1.position, app.user1.store, app.user1.holes])
      .not
      .toBeUndefined();
    expect([app.user2.id, app.user2.position, app.user2.store, app.user2.holes])
      .not
      .toBeUndefined();
  });


  describe("markers rules", () => {
    it(`should have 48 markers on total`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      app.ngOnInit();

      const total = app.user1.holes.reduce((n, { piece }) => n + piece, 0)
        + app.user2.holes.reduce((n, { piece }) => n + piece, 0);

      expect(total).toBe(48);
    });
    it(`should have 6 hole each side`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      app.ngOnInit();

      const total = app.user1.holes.length == 6 &&
        app.user2.holes.length == 6;

      expect(total).toBe(true);
    });
    it(`should have 4 markers each hole`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      app.ngOnInit();

      const pieceChecker = app.user1.holes.every(hole => hole.piece == 4) &&
        app.user2.holes.every(hole => hole.piece == 4)

      expect(pieceChecker).toBe(true);
    });
  });

  describe("test checkGameOver() method", () => {
    const parameterized = [
      {
        description: "Should false if two players have at least one stone in one of their holes",
        param1: { ...user1, holes: [{ piece: 1 }] },
        param2: { ...user2, holes: [{ piece: 1 }] },
        returnedData: false
      },
      {
        description: "Should true holes of one of two player are empty",
        param1: { ...user1, holes: [{ piece: 0 }] },
        param2: { ...user2, holes: [{ piece: 4 }, { piece: 4 }] },
        returnedData: true
      }
    ];

    parameterized.forEach((parameter) => {
      it(parameter.description, () => {
        const fixture = TestBed.createComponent(MancalaComponent);
        const app = fixture.componentInstance;
        app.user1 = parameter.param1;
        app.user2 = parameter.param2;
        const result = app.checkGameOver(app.user1, app.user2);
        expect(result).toBe(parameter.returnedData);
      });
    });
  });

  describe("test userMarkersLeftInHoles() method", () => {
    const parameterized: { param: Hole[], description: string, returnedData: number }[] = [
      {
        description: "Should return 5 total of pieces in holes",
        param: [{ piece: 3 }, { piece: 1 }, { piece: 0 }, { piece: 1 }],
        returnedData: 5
      },
      {
        description: "Should return 2 total of pieces in holes",
        param: [{ piece: 1 }, { piece: 0 }, { piece: 1 }, { piece: 0 }],
        returnedData: 2
      },
      {
        description: "Should return 0 total of pieces in holes",
        param: [{ piece: 0 }, { piece: 0 }, { piece: 0 }, { piece: 0 }],
        returnedData: 0
      }
    ];

    parameterized.forEach((parameter) => {
      it(parameter.description, () => {
        const fixture = TestBed.createComponent(MancalaComponent);
        const app = fixture.componentInstance;
        const holes = parameter.param;
        const result = app.userMarkersLeftInHoles(holes);
        expect(result).toBe(parameter.returnedData);
      });
    });

  });

  describe("test isLast() method", () => {
    const parameterized: { param1: number, param2: Position, description: string, returnedData: boolean }[] = [
      {
        description: "Should true position is down and index is 5",
        param1: 5,
        param2: "down",
        returnedData: true
      },
      {
        description: "Should true position is up and index is 0",
        param1: 0,
        param2: "up",
        returnedData: true
      },
      {
        description: "Should false position is down and index is less than 5",
        param1: 4,
        param2: "down",
        returnedData: false
      },
      {
        description: "Should false position is up and index is greater than 0",
        param1: 1,
        param2: "up",
        returnedData: false
      },
    ];

    parameterized.forEach((parameter) => {
      it(parameter.description, () => {
        const fixture = TestBed.createComponent(MancalaComponent);
        const app = fixture.componentInstance;
        const indx = parameter.param1;
        const position = parameter.param2;
        const result = app.isLast(indx, position);
        expect(result).toBe(parameter.returnedData);
      });
    });

  });

  it(`should have as isOwnHole() 'true'`, () => {
    const fixture = TestBed.createComponent(MancalaComponent);
    const app = fixture.componentInstance;
    const position1: Position = 'down';
    const position2: Position = 'down';
    const result = app.isOwnHole(position1, position2);
    expect(result).toEqual(true);
  });

  describe("test calculateResults() method", () => {
    const parameterized = [
      {
        description: "Should true if param1 won #1",
        param1: { ...user1, store: 26, holes: [{ piece: 0 }, { piece: 0 }, { piece: 0 }, { piece: 0 }] },
        param2: { ...user2, store: 22, holes: [{ piece: 0 }, { piece: 0 }, { piece: 0 }, { piece: 0 }] },
        returnedData: `${user1.id} won`
      },
      {
        description: "Should true if param1 won #2",
        param1: { ...user1, store: 21, holes: [{ piece: 4 }, { piece: 0 }, { piece: 2 }, { piece: 0 }] },
        param2: { ...user2, store: 21, holes: [{ piece: 0 }, { piece: 0 }, { piece: 0 }, { piece: 0 }] },
        returnedData: `${user1.id} won`
      },
      {
        description: "Should true if param2 won",
        param1: { ...user1, store: 20, holes: [{ piece: 3 }, { piece: 0 }, { piece: 0 }, { piece: 0 }] },
        param2: { ...user2, store: 25, holes: [{ piece: 0 }, { piece: 0 }, { piece: 0 }, { piece: 0 }] },
        returnedData: `${user2.id} won`
      },
    ];

    parameterized.forEach((parameter) => {
      it(parameter.description, () => {
        const fixture = TestBed.createComponent(MancalaComponent);
        const app = fixture.componentInstance;
        app.user1 = parameter.param1;
        app.user2 = parameter.param2;
        const result = app.calculateResults(app.user1, app.user2);
        expect(result).toBe(parameter.returnedData);
      });
    });
  });

  describe("test moveIt() method", () => {

    it(`should undefined if game over, not turn, piece 0`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      app.ngOnInit();
      app.isGameOver = true;
      app.turn = user2.id;
      const result = app.moveIt({ piece: 0 }, user1, 4, user2);
      expect(result).toBeUndefined();
    });

    it(`should true`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      app.ngOnInit();
      app.isGameOver = false;
      app.turn = user1.id;
      const result = app.moveIt({ piece: 1 }, user1, 4, user2);
      expect(result).toBe(true);
    });

    it(`should match`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      app.ngOnInit();
      app.isGameOver = false;
      app.turn = user2.id;
      app.user1 = { ...user1 };
      app.user2 = { ...user2 };
      const data = app.moveIt(app.user2.holes[0], user2, 0, user1);
      expect(app.user2.holes[0].piece).toBe(1);
    });

    it(`should hole clickable`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      spyOn(app, 'moveIt');
      app.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const holes = compiled.querySelectorAll<HTMLElement>('.holes-container .hole');
      holes[0].click();
      const result = app.moveIt({ piece: 1 }, user1, 4, user2);
      expect(app.moveIt).toHaveBeenCalled();
    });

    it(`should match 4 each hole markers`, () => {
      const fixture = TestBed.createComponent(MancalaComponent);
      const app = fixture.componentInstance;
      spyOn(app, 'moveIt');
      app.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const holes = compiled.querySelectorAll<HTMLElement>('.holes-container .hole div');

      holes.forEach((elem) => expect(elem?.textContent).toBe('4'));

    });

  });

});
