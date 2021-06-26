import {AGS} from "./AGS";
import {
    BundeslandSchluessel,
    GemeindeSchluessel,
    KreisSchluessel,
    RegierungsbezirkSchluessel,
    VerbandSchluessel,
    Verbandstyp
} from "./schluessel";

export class ARS {
    public readonly land: BundeslandSchluessel
    public readonly regierunsbezirk: RegierungsbezirkSchluessel
    public readonly kreis: KreisSchluessel
    public readonly verband: VerbandSchluessel
    public readonly gemeinde: GemeindeSchluessel

    constructor(land: BundeslandSchluessel,
                regierunsbezirk?: RegierungsbezirkSchluessel,
                kreis?: KreisSchluessel,
                verband?: VerbandSchluessel,
                gemeinde?: GemeindeSchluessel) {
        this.land = land;
        this.regierunsbezirk = regierunsbezirk;
        this.kreis = kreis;
        this.verband = verband;
        this.gemeinde = gemeinde;
    }

    public static fromString(ars: string): ARS | null {
        try {
            return ArsParser.parse(ars);
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    private static isVerbandstyp(typ: string): typ is Verbandstyp {
        return /^[059]$/.test(typ);
    }

    public toString(): string {
        return this.land +
            (this.regierunsbezirk ?? "") +
            (this.kreis ?? "") +
            (this.verband ?? "") +
            (this.gemeinde ?? "");
    }

    public toAGS(): AGS {
        const ags = this.land +
            (this.regierunsbezirk ?? "") +
            (this.kreis ?? "") +
            (this.gemeinde ?? "");

        return AGS.fromString(ags);
    }

    public isVerbandsfreieGemeinde(): boolean {
        return this.getVerbandstyp() === Verbandstyp.VerbandsfreieGemeinde;
    }

    public isVerbandsangehoerigeGemeinde(): boolean {
        return this.getVerbandstyp() === Verbandstyp.VerbandsangehoerigeGemeinde;
    }

    public isGemeindefreiesGebiet(): boolean {
        return this.getVerbandstyp() === Verbandstyp.GemeindefreiesGebiet;
    }

    private getVerbandstyp(): Verbandstyp | null {
        if (this.verband) {
            const tKennzeichen = this.verband.substr(0, 1);
            if (ARS.isVerbandstyp(tKennzeichen)) {
                return tKennzeichen;
            }
        }
        return null;
    }
}

class ArsParser {
    public static parse(ars: string): ARS {
        if (!/^\d{2,12}$/.test(ars)) {
            throw new Error("invalid ARS string");
        }

        const land = ArsParser.parseBundeslandSchluessel(ars);
        const len = ars.length;

        let rb: RegierungsbezirkSchluessel = null;
        if (len >= 3) {
            rb = ArsParser.parseRegierunsbezirkSchluessel(ars);
        }

        let kreis: KreisSchluessel = null;
        if (len >= 5) {
            kreis = ArsParser.parseKreisSchluessel(ars);
        }

        let verband: VerbandSchluessel = null;
        if (len >= 9) {
            verband = ArsParser.parseVerbandSchluessel(ars);
        }

        let gemeinde: GemeindeSchluessel = null;
        if (len === 12) {
            gemeinde = ArsParser.parseGemeindeSchluessel(ars);
        }

        return new ARS(land, rb, kreis, verband, gemeinde);
    }

    private static parseBundeslandSchluessel(ars: string): BundeslandSchluessel {
        const land = ars.substr(0, 2);
        if (!ArsParser.isBundeslandSchluessel(land)) {
            throw new Error("invalid ARS Bundesland string");
        }
        return land;
    }

    private static isBundeslandSchluessel(land: string): land is BundeslandSchluessel {
        return /^([0][1-9]|[1][0-4])$/.test(land);
    }

    private static parseRegierunsbezirkSchluessel(ars: string): RegierungsbezirkSchluessel {
        const rb = ars.substr(2, 1);
        if (!ArsParser.isRegierungsbezirkSchluessel(rb)) {
            throw new Error("invalid ARS Regierungsbezirk string");
        }
        return rb;
    }

    private static isRegierungsbezirkSchluessel(rb: string): rb is RegierungsbezirkSchluessel {
        return /^\d$/.test(rb);
    }

    private static parseKreisSchluessel(ars: string): KreisSchluessel {
        const kreis = ars.substr(3, 2);
        if (!ArsParser.isKreisSchluessel(kreis)) {
            throw new Error("invalid ARS Kreis string");
        }
        return kreis;
    }

    private static isKreisSchluessel(kreis: string): kreis is KreisSchluessel {
        return /^\d{2}$/.test(kreis);
    }

    private static parseVerbandSchluessel(ars: string): VerbandSchluessel {
        const verband = ars.substr(5, 4);
        if (!ArsParser.isVerbandSchluessel(verband)) {
            throw new Error("invalid ARS Verband string");
        }
        return verband;
    }

    private static isVerbandSchluessel(verband: string): verband is VerbandSchluessel {
        return /^([059])\d{3}$/.test(verband);
    }

    private static parseGemeindeSchluessel(ars: string): GemeindeSchluessel {
        const gemeinde = ars.substr(9, 3);
        if (!ArsParser.isGemeindeSchluessel(gemeinde)) {
            throw new Error("invalid ARS Gemeinde string");
        }
        return gemeinde;
    }

    private static isGemeindeSchluessel(gemeinde: string): gemeinde is GemeindeSchluessel {
        return /^\d{3}$/.test(gemeinde);
    }
}