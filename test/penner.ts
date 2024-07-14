import chai from "chai";
const should = chai.should();
import penner from "../src/lib/penner";

describe("penner", () => {
  it("linear", () => {
    const p = penner();
    p.linear()(0.5).should.equal(0.5);
  });

  it("easeInSine", () => {
    const p = penner();
    p.easeInSine()(0.5).should.equal(0.2928932188134524);
  });

  it("easeOutSine", () => {
    const p = penner();
    p.easeOutSine()(0.5).should.equal(0.7071067811865476);
  });

  it("easeInOutSine", () => {
    const p = penner();
    p.easeInOutSine()(0.5).should.equal(0.5);
  });

  it("easeOutInSine", () => {
    const p = penner();
    p.easeOutInSine()(0.5).should.equal(0.5);
  });

  it("easeInQuad", () => {
    const p = penner();
    p.easeInQuad()(0.5).should.equal(0.25);
  });

  it("easeOutQuad", () => {
    const p = penner();
    p.easeOutQuad()(0.5).should.equal(0.75);
  });

  it("easeInOutQuad", () => {
    const p = penner();
    p.easeInOutQuad()(0.5).should.equal(0.5);
  });

  it("easeOutInQuad", () => {
    const p = penner();
    p.easeOutInQuad()(0.5).should.equal(0.5);
  });

  it("easeInCubic", () => {
    const p = penner();
    p.easeInCubic()(0.5).should.equal(0.125);
  });

  it("easeOutCubic", () => {
    const p = penner();
    p.easeOutCubic()(0.5).should.equal(0.875);
  });

  it("easeInOutCubic", () => {
    const p = penner();
    p.easeInOutCubic()(0.5).should.equal(0.5);
  });

  it("easeOutInCubic", () => {
    const p = penner();
    p.easeOutInCubic()(0.5).should.equal(0.5);
  });

  it("easeInQuart", () => {
    const p = penner();
    p.easeInQuart()(0.5).should.equal(0.0625);
  });

  it("easeOutQuart", () => {
    const p = penner();
    p.easeOutQuart()(0.5).should.equal(0.9375);
  });

  it("easeInOutQuart", () => {
    const p = penner();
    p.easeInOutQuart()(0.5).should.equal(0.5);
  });

  it("easeOutInQuart", () => {
    const p = penner();
    p.easeOutInQuart()(0.5).should.equal(0.5);
  });

  it("easeInQuint", () => {
    const p = penner();
    p.easeInQuint()(0.5).should.equal(0.03125);
  });

  it("easeOutQuint", () => {
    const p = penner();
    p.easeOutQuint()(0.5).should.equal(0.96875);
  });

  it("easeInOutQuint", () => {
    const p = penner();
    p.easeInOutQuint()(0.5).should.equal(0.5);
  });

  it("easeOutInQuint", () => {
    const p = penner();
    p.easeOutInQuint()(0.5).should.equal(0.5);
  });

  it("easeInExpo", () => {
    const p = penner();
    p.easeInExpo()(0.5).should.equal(0.03125);
  });

  it("easeOutExpo", () => {
    const p = penner();
    p.easeOutExpo()(0.5).should.equal(0.96875);
  });

  it("easeInOutExpo", () => {
    const p = penner();
    p.easeInOutExpo()(0.5).should.equal(0.5);
  });

  it("easeOutInExpo", () => {
    const p = penner();
    p.easeOutInExpo()(0.5).should.equal(0.5);
  });

  it("easeInCirc", () => {
    const p = penner();
    p.easeInCirc()(0.5).should.equal(0.1339745962155614);
  });

  it("easeOutCirc", () => {
    const p = penner();
    p.easeOutCirc()(0.5).should.equal(0.8660254037844386);
  });

  it("easeInOutCirc", () => {
    const p = penner();
    p.easeInOutCirc()(0.5).should.equal(0.5);
  });

  it("easeOutInCirc", () => {
    const p = penner();
    p.easeOutInCirc()(0.5).should.equal(0.5);
  });

  it.skip("easeInBack", () => {
    // not real easeInBack
    const p = penner();
    p.easeInBack()(0.5).should.equal(-0.0876975);
  });

  it.skip("easeOutBack", () => {
    // not real easeOutBack
    const p = penner();
    p.easeOutBack()(0.5).should.equal(1.0876975);
  });

  it("easeInOutBack", () => {
    // not real easeInOutBack
    const p = penner();
    p.easeInOutBack()(0.5).should.equal(0.5);
  });

  it("easeOutInBack", () => {
    // not real easeOutInBack
    const p = penner();
    p.easeOutInBack()(0.5).should.equal(0.5);
  });

  it.skip("easeInBounce", () => {
    // not real easeInBounce
    const p = penner();
    p.easeInBounce()(0.5).should.equal(0.046875);
  });

  it.skip("easeOutBounce", () => {
    // not real easeOutBounce
    const p = penner();
    p.easeOutBounce()(0.5).should.equal(0.953125);
  });

  it("easeInOutBounce", () => {
    // not real easeInOutBounce
    const p = penner();
    p.easeInOutBounce()(0.5).should.equal(0.5);
  });

  it("easeOutInBounce", () => {
    // not real easeOutInBounce
    const p = penner();
    p.easeOutInBounce()(0.5).should.equal(0.5);
  });
});
