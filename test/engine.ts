import chai from "chai";
const should = chai.should();
import Anime from "../src/Anime";
import engine from "../src/lib/engine";
import { JSDOM } from "jsdom";
import sinon from "sinon";

describe("engine", () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><div id="test" style="left: 0px; width: 100%; transform: translateX(0px)">Hello world</div>`
  );
  global.HTMLElement = dom.window.HTMLElement;

  it("engine - delay", (done) => {
    const targets = { x: 1 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(1);
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.x.should.equal(1.5);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      x: 2,
      delay: 500,
    });
    engine(anime);
  });

  it("engine - callback function", (done) => {
    const beginCallback = sinon.spy();
    const updateCallback = sinon.spy();
    const completeCallback = sinon.spy();
    const targets = { x: 1 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      beginCallback.calledOnce.should.be.true;
      global.requestAnimationFrame = (cb) => {
        Date.now = () => 1000;
        updateCallback.called.should.be.true;
        global.requestAnimationFrame = (cb) => {
          Date.now = () => 1500;
          cb(0);
          completeCallback.calledOnce.should.be.true;
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      x: 2,
      begin: beginCallback,
      update: updateCallback,
      complete: completeCallback,
    });
    engine(anime);
  });

  it("engine - plain object, linear, base property", (done) => {
    const targets = { x: 1 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(1.5);
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.x.should.equal(2);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      x: 2,
    });
    engine(anime);
  });

  it("engine - plain object, linear, function property", (done) => {
    const targets = { x: 1 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(1.5);
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.x.should.equal(2);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      x: () => 2,
    });
    engine(anime);
  });

  it("engine - plain object, easeInExpo, base property", (done) => {
    const targets = { x: 1 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(1.03125);
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.x.should.equal(2);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      easing: "easeInExpo",
      x: 2,
    });
    engine(anime);
  });

  it("engine - plain object, linear, from-to property", (done) => {
    const targets = { x: 1 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(15);
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.x.should.equal(20);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      x: [10, 20],
    });
    engine(anime);
  });

  it("engine - plain object, linear, keyframe property", (done) => {
    const targets = { x: 5 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 200;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(10);
        Date.now = () => 600;
        global.requestAnimationFrame = (cb) => {
          Date.now = () => 1100;
          targets.x.should.equal(20);
          cb(0);
          targets.x.should.equal(20);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      x: [
        { value: 10, duration: 200 },
        { value: 20, duration: 400 },
      ],
    });
    engine(anime);
  });

  it("engine - plain object, linear, nest property", (done) => {
    const targets = { x: 5 };
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 100;
      global.requestAnimationFrame = (cb) => {
        targets.x.should.equal(7.5);
        Date.now = () => 200;
        global.requestAnimationFrame = (cb) => {
          targets.x.should.equal(10);
          Date.now = () => 1100;
          cb(0);
          targets.x.should.equal(10);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      easing: "easeInBack",
      x: { value: 10, duration: 200, easing: "linear" },
    });
    engine(anime);
  });

  it("engine - dom object, linear, style property with px", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.style.left.should.equal("100px");
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.style.left.should.equal("200px");
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      left: "200px",
    });
    engine(anime);
  });

  it("engine - dom object, linear, style property with %", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.style.width.should.equal("150%");
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.style.width.should.equal("200%");
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      width: "200%",
    });
    engine(anime);
  });

  it("engine - dom object, linear, style property with invalid unit", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      width: "200rem",
    });
    try {
      engine(anime);
    } catch (e) {
      e.message.should.equal(`string value must ends with '%' or 'px'`);
      done();
    }
  });

  it("engine - dom object, linear, attribute property", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    // @ts-expect-error
    targets.a = 1;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        // @ts-expect-error
        targets.a.should.equal(1.5);
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          // @ts-expect-error
          targets.a.should.equal(2);
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      a: 2,
    });
    engine(anime);
  });

  it("engine - dom object, linear, transform property", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.style.transform.should.equal("translateX(100px)");
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.style.transform.should.equal("translateX(200px)");
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      translateX: "200px",
    });
    engine(anime);
  });

  it("engine - dom object, linear, transform from-to property with px", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.style.transform.should.equal("translateX(250px)");
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.style.transform.should.equal("translateX(300px)");
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      translateX: ["200px", "300px"],
    });
    engine(anime);
  });

  it("engine - dom object, linear, transform from-to property without px", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.style.transform.should.equal("translateX(250px)");
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.style.transform.should.equal("translateX(300px)");
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      translateX: [200, 300],
    });
    engine(anime);
  });

  it("engine - dom object, linear, style from-to property", (done) => {
    const targets = dom.window.document.getElementById("test")!;
    global.requestAnimationFrame = (cb) => {
      Date.now = () => 500;
      global.requestAnimationFrame = (cb) => {
        targets.style.left.should.equal("550px");
        Date.now = () => 1000;
        global.requestAnimationFrame = (cb) => {
          targets.style.left.should.equal("600px");
          done();
          return 0;
        };
        cb(0);
        return 0;
      };
      cb(0);
      return 0;
    };
    Date.now = () => 0;
    const anime = new Anime({
      targets,
      duration: 1000,
      left: ["500px", "600px"],
    });
    engine(anime);
  });
});
