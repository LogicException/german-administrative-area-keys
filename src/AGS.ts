import {
    BundeslandSchluessel,
    GemeindeSchluessel,
    KreisSchluessel,
    RegierungsbezirkSchluessel
} from "./schluessel";

export class AGS {
    public readonly land: BundeslandSchluessel
    public readonly regierunsbezirk: RegierungsbezirkSchluessel
    public readonly kreis: KreisSchluessel
    public readonly gemeinde: GemeindeSchluessel

    constructor(land: BundeslandSchluessel,
                regierunsbezirk?: RegierungsbezirkSchluessel,
                kreis?: KreisSchluessel,
                gemeinde?: GemeindeSchluessel) {
        this.land = land;
        this.regierunsbezirk = regierunsbezirk;
        this.kreis = kreis;
        this.gemeinde = gemeinde;
    }

    public static fromString(ags: string): AGS | null {
        try {
            return AgsParser.parse(ags);
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    public toString(): string {
        return this.land +
            (this.regierunsbezirk ?? "") +
            (this.kreis ?? "") +
            (this.gemeinde ?? "");
    }
}

class AgsParser {
    public static parse(ags: string): AGS {

        if (!/^[0-9]{2,8}$/.test(ags)) {
            throw new Error("invalid AGS string");
        }
        const land = AgsParser.parseBundeslandSchluessel(ags);
        const len = ags.length;

        let rb: RegierungsbezirkSchluessel = null;
        if (len >= 3) {
            rb = AgsParser.parseRegierunsbezirkSchluessel(ags);
        }

        let kreis: KreisSchluessel = null;
        if (len >= 5) {
            kreis = AgsParser.parseKreisSchluessel(ags);
        }

        let gemeinde: GemeindeSchluessel = null;
        if (len === 8) {
            gemeinde = AgsParser.parseGemeindeSchluessel(ags);
        }

        return new AGS(land, rb, kreis, gemeinde);
    }

    private static parseBundeslandSchluessel(agr: string): BundeslandSchluessel {
        const land = agr.substr(0, 2);
        if (!AgsParser.isBundeslandSchluessel(land)) {
            throw new Error("invalid AGS Bundesland string");
        }
        return land;
    }

    private static isBundeslandSchluessel(land: string): land is BundeslandSchluessel {
        return /^([0][1-9]|[1][0-4])$/.test(land);
    }

    private static parseRegierunsbezirkSchluessel(agr: string): RegierungsbezirkSchluessel {
        const rb = agr.substr(2, 1);
        if (!AgsParser.isRegierungsbezirkSchluessel(rb)) {
            throw new Error("invalid AGS Regierungsbezirk string");
        }
        return rb;
    }

    private static isRegierungsbezirkSchluessel(rb: string): rb is RegierungsbezirkSchluessel {
        return /^[0-9]$/.test(rb);
    }

    private static parseKreisSchluessel(agr: string): KreisSchluessel {
        const kreis = agr.substr(3, 2);
        if (!AgsParser.isKreisSchluessel(kreis)) {
            throw new Error("invalid AGS Kreis string");
        }
        return kreis;
    }

    private static isKreisSchluessel(kreis: string): kreis is KreisSchluessel {
        return /^[0-9]{2}$/.test(kreis);
    }

    private static parseGemeindeSchluessel(agr: string): GemeindeSchluessel {
        const gemeinde = agr.substr(5, 3);
        if (!AgsParser.isGemeindeSchluessel(gemeinde)) {
            throw new Error("invalid AGS Gemeinde string");
        }
        return gemeinde;
    }

    private static isGemeindeSchluessel(gemeinde: string): gemeinde is GemeindeSchluessel {
        return /^[0-9]{3}$/.test(gemeinde);
    }
}