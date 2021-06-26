import {describe, it} from "mocha";
import {expect} from "chai";
import {AGS} from "../src/AGS";

describe("AGS can be parsed", () => {
    it("should can create AGS", () => {
        const ags = new AGS("14", "7", "30", "070");

        expect(ags).not.to.be.null;

        expect(ags).to.be.an("object").and.to.have.property("land");
        expect(ags.land).to.be.eq("14");

        expect(ags).to.be.an("object").and.to.have.property("regierunsbezirk");
        expect(ags.regierunsbezirk).to.be.eq("7");

        expect(ags).to.be.an("object").and.to.have.property("kreis");
        expect(ags.kreis).to.be.eq("30");

        expect(ags).to.be.an("object").and.to.have.property("gemeinde");
        expect(ags.gemeinde).to.be.eq("070");
    });

    it("should can create AGS from string", () => {
        const ags = AGS.fromString("14730070");
        expect(ags).not.to.be.null;
        expect(ags.land).to.be.eq("14");
        expect(ags.regierunsbezirk).to.be.eq("7");
        expect(ags.kreis).to.be.eq("30");
        expect(ags.gemeinde).to.be.eq("070");
    });
});