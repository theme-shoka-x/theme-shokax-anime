import chai from "chai";
const should = chai.should();
import penner from "../src/lib/penner";

describe("penner", () => {
  const p = penner();
  it("linear", () => {
    p.linear()(0.5).should.equal(0.5);
  });

  it("easeInSine", () => {
    p.easeInSine()(0.5).should.equal(0.2928932188134524);
  });

  it("easeOutSine", () => {
    p.easeOutSine()(0.5).should.equal(0.7071067811865476);
  });

  it("easeInOutSine", () => {
    p.easeInOutSine()(0.5).should.equal(0.5);
  });

  it("easeOutInSine", () => {
    p.easeOutInSine()(0.5).should.equal(0.5);
  });

  it("easeInQuad", () => {
    p.easeInQuad()(0.5).should.equal(0.25);
  });

  it("easeOutQuad", () => {
    p.easeOutQuad()(0.5).should.equal(0.75);
  });

  it("easeInOutQuad", () => {
    p.easeInOutQuad()(0.5).should.equal(0.5);
  });

  it("easeOutInQuad", () => {
    p.easeOutInQuad()(0.5).should.equal(0.5);
  });

  it("easeInCubic", () => {
    p.easeInCubic()(0.5).should.equal(0.125);
  });

  it("easeOutCubic", () => {
    p.easeOutCubic()(0.5).should.equal(0.875);
  });

  it("easeInOutCubic", () => {
    p.easeInOutCubic()(0.5).should.equal(0.5);
  });

  it("easeOutInCubic", () => {
    p.easeOutInCubic()(0.5).should.equal(0.5);
  });

  it("easeInQuart", () => {
    p.easeInQuart()(0.5).should.equal(0.0625);
  });

  it("easeOutQuart", () => {
    p.easeOutQuart()(0.5).should.equal(0.9375);
  });

  it("easeInOutQuart", () => {
    p.easeInOutQuart()(0.5).should.equal(0.5);
  });

  it("easeOutInQuart", () => {
    p.easeOutInQuart()(0.5).should.equal(0.5);
  });

  it("easeInQuint", () => {
    p.easeInQuint()(0.5).should.equal(0.03125);
  });

  it("easeOutQuint", () => {
    p.easeOutQuint()(0.5).should.equal(0.96875);
  });

  it("easeInOutQuint", () => {
    p.easeInOutQuint()(0.5).should.equal(0.5);
  });

  it("easeOutInQuint", () => {
    p.easeOutInQuint()(0.5).should.equal(0.5);
  });

  it("easeInExpo", () => {
    p.easeInExpo()(0.5).should.equal(0.03125);
  });

  it("easeOutExpo", () => {
    p.easeOutExpo()(0.5).should.equal(0.96875);
  });

  it("easeInOutExpo", () => {
    p.easeInOutExpo()(0.5).should.equal(0.5);
  });

  it("easeOutInExpo", () => {
    p.easeOutInExpo()(0.5).should.equal(0.5);
  });

  it("easeInCirc", () => {
    p.easeInCirc()(0.5).should.equal(0.1339745962155614);
  });

  it("easeOutCirc", () => {
    p.easeOutCirc()(0.5).should.equal(0.8660254037844386);
  });

  it("easeInOutCirc", () => {
    p.easeInOutCirc()(0.5).should.equal(0.5);
  });

  it("easeOutInCirc", () => {
    p.easeOutInCirc()(0.5).should.equal(0.5);
  });

  it.skip("easeInBack", () => {
    // not real easeInBack
    p.easeInBack()(0.5).should.equal(-0.0876975);
  });

  it.skip("easeOutBack", () => {
    // not real easeOutBack
    p.easeOutBack()(0.5).should.equal(1.0876975);
  });

  it("easeInOutBack", () => {
    // not real easeInOutBack
    p.easeInOutBack()(0.5).should.equal(0.5);
  });

  it("easeOutInBack", () => {
    // not real easeOutInBack
    p.easeOutInBack()(0.5).should.equal(0.5);
  });

  it.skip("easeInBounce", () => {
    // not real easeInBounce
    p.easeInBounce()(0.5).should.equal(0.046875);
  });

  it.skip("easeOutBounce", () => {
    // not real easeOutBounce
    p.easeOutBounce()(0.5).should.equal(0.953125);
  });

  it("easeInOutBounce", () => {
    // not real easeInOutBounce
    p.easeInOutBounce()(0.5).should.equal(0.5);
  });

  it("easeOutInBounce", () => {
    // not real easeOutInBounce
    p.easeOutInBounce()(0.5).should.equal(0.5);
  });
});
