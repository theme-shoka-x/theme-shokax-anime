import chai from "chai";
const should = chai.should();
import Timeline from "../src/Timeline";
import Anime from "../src/Anime";

describe("timeline", () => {

  it('new', () => {
    const timeline = new Timeline();
    timeline.queue.should.deep.equal([]);
  });

  it('add', () => {
    const timeline = new Timeline();
    timeline.add();
    timeline.queue.length.should.equal(1);
    (timeline.queue[0] instanceof Anime).should.be.true;
  });

  it('play', () => {
    global.requestAnimationFrame = () => 0;
    const timeline = new Timeline();
    timeline.add();
    timeline.play();
    timeline.queue[0].isPlay.should.be.true;
  });
});
