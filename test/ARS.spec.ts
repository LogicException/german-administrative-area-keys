import {describe, it} from "mocha";
import {expect} from "chai";
import {ARS} from "../src/ARS";

describe("ARS can be parsed", () => {
    it("should can create ARS", () => {
        const ars = new ARS("14", "7", "30", "0070", "070");

        expect(ars).not.to.be.null;

        expect(ars).to.be.an("object").and.to.have.property("land");
        expect(ars.land).to.be.eq("14");

        expect(ars).to.be.an("object").and.to.have.property("regierunsbezirk");
        expect(ars.regierunsbezirk).to.be.eq("7");

        expect(ars).to.be.an("object").and.to.have.property("kreis");
        expect(ars.kreis).to.be.eq("30");

        expect(ars).to.be.an("object").and.to.have.property("verband");
        expect(ars.verband).to.be.eq("0070");

        expect(ars).to.be.an("object").and.to.have.property("gemeinde");
        expect(ars.gemeinde).to.be.eq("070");
    });

    it("should can use ARS as string", () => {
        const ars = new ARS("14", "7", "30", "0070", "070");
        expect(ars.toString()).to.be.eq("147300070070");
    });

    it("should can create ARS from string", () => {
        const ars = ARS.fromString("147300070070");
        expect(ars).not.to.be.null;
        expect(ars.land).to.be.eq("14");
        expect(ars.regierunsbezirk).to.be.eq("7");
        expect(ars.kreis).to.be.eq("30");
        expect(ars.verband).to.be.eq("0070");
        expect(ars.gemeinde).to.be.eq("070");
    });

    it("should can create AGS from ARS", () => {
        const ars = new ARS("14", "7", "30", "0070", "070");
        const ags = ars.toAGS();
        expect(ags.toString()).to.be.eq("14730070");
    });

    it("should can get Verbandstyp VerbandsfreieGemeinde from ARS", () => {
        // Delitzsch
        const ars = new ARS("14", "7", "30", "0070", "070");
        expect(ars.isVerbandsfreieGemeinde()).to.be.true;
    });

    it("should can get Verbandstyp VerbandsangehoerigeGemeinde from ARS", () => {
        // Pirna
        const ars = new ARS("14", "6", "28", "5229", "270");
        expect(ars.isVerbandsangehoerigeGemeinde()).to.be.true;
    });

    it("should can get Verbandstyp GemeindefreiesGebiet from ARS", () => {
        // Sachsenwald: 010539105105
        const ars = ARS.fromString("010539105105");
        expect(ars).not.to.be.null;
        expect(ars.isGemeindefreiesGebiet()).to.be.true;
    });
});