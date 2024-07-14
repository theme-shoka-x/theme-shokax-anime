import chai from "chai";
const should = chai.should();
import Anime from "../src/Anime";
import { defaultOptions } from "../src/defaultOptions";
import { JSDOM } from "jsdom";
import Timeline from "../src/Timeline";

describe("anime", () => {
  it('new - default', () => {
    const anime = new Anime();
    should.equal(anime.targets, defaultOptions.targets);
    anime.duration.should.equal(defaultOptions.duration);
    anime.easing.should.equal(defaultOptions.easing);
    anime.delay.should.equal(defaultOptions.delay);
    should.equal(anime.begin, defaultOptions.begin);
    should.equal(anime.update, defaultOptions.update);
    should.equal(anime.complete, defaultOptions.complete);
    anime.dest.should.deep.equal({});
    should.equal(anime.tl, null);
    anime.isPlay.should.be.false;
  });

  it('new - custom', () => {
    const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
    const targets = [dom.window.document.createElement('div')];
    const duration = 1000;
    const easing = 'linear';
    const delay = 100;
    const begin = () => {};
    const update = () => {};
    const complete = () => {};
    const dest = { opacity: 1 };
    const anime = new Anime({ targets, duration, easing, delay, begin, update, complete, ...dest });
    should.equal(anime.targets, targets);
    anime.duration.should.equal(duration);
    anime.easing.should.equal(easing);
    anime.delay.should.equal(delay);
    should.equal(anime.begin, begin);
    should.equal(anime.update, update);
    should.equal(anime.complete, complete);
    anime.dest.should.deep.equal(dest);
    should.equal(anime.tl, null);
    anime.isPlay.should.be.false;
  });

  it('timeline', () => {
    const anime = new Anime();
    const tl = anime.timeline();
    tl.should.be.an.instanceOf(Timeline);
  });

  it('play', () => {
    global.requestAnimationFrame = () => 0;
    const anime = new Anime();
    anime.play();
    anime.isPlay.should.be.true;
  });
});