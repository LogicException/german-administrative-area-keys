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

    public static fromString(agr: string): ARS | null {
        try {
            return AgrParser.parse(agr);
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

class AgrParser {
    public static parse(agr: string): ARS {
        if (!/^[0-9]{2,12}$/.test(agr)) {
            throw new Error("invalid AGR string");
        }

        const land = AgrParser.parseBundeslandSchluessel(agr);
        const len = agr.length;

        let rb: RegierungsbezirkSchluessel = null;
        if (len >= 3) {
            rb = AgrParser.parseRegierunsbezirkSchluessel(agr);
        }

        let kreis: KreisSchluessel = null;
        if (len >= 5) {
            kreis = AgrParser.parseKreisSchluessel(agr);
        }

        let verband: VerbandSchluessel = null;
        if (len >= 9) {
            verband = AgrParser.parseVerbandSchluessel(agr);
        }

        let gemeinde: GemeindeSchluessel = null;
        if (len === 12) {
            gemeinde = AgrParser.parseGemeindeSchluessel(agr);
        }

        return new ARS(land, rb, kreis, verband, gemeinde);
    }

    private static parseBundeslandSchluessel(agr: string): BundeslandSchluessel {
        const land = agr.substr(0, 2);
        if (!AgrParser.isBundeslandSchluessel(land)) {
            throw new Error("invalid AGR Bundesland string");
        }
        return land;
    }

    private static isBundeslandSchluessel(land: string): land is BundeslandSchluessel {
        return /^([0][1-9]|[1][0-4])$/.test(land);
    }

    private static parseRegierunsbezirkSchluessel(agr: string): RegierungsbezirkSchluessel {
        const rb = agr.substr(2, 1);
        if (!AgrParser.isRegierungsbezirkSchluessel(rb)) {
            throw new Error("invalid AGR Regierungsbezirk string");
        }
        return rb;
    }

    private static isRegierungsbezirkSchluessel(rb: string): rb is RegierungsbezirkSchluessel {
        return /^[0-9]$/.test(rb);
    }

    private static parseKreisSchluessel(agr: string): KreisSchluessel {
        const kreis = agr.substr(3, 2);
        if (!AgrParser.isKreisSchluessel(kreis)) {
            throw new Error("invalid AGR Kreis string");
        }
        return kreis;
    }

    private static isKreisSchluessel(kreis: string): kreis is KreisSchluessel {
        return /^[0-9]{2}$/.test(kreis);
    }

    private static parseVerbandSchluessel(agr: string): VerbandSchluessel {
        const verband = agr.substr(5, 4);
        if (!AgrParser.isVerbandSchluessel(verband)) {
            throw new Error("invalid AGR Verband string");
        }
        return verband;
    }

    private static isVerbandSchluessel(verband: string): verband is VerbandSchluessel {
        return /^([059])[0-9]{3}$/.test(verband);
    }

    private static parseGemeindeSchluessel(agr: string): GemeindeSchluessel {
        const gemeinde = agr.substr(9, 3);
        if (!AgrParser.isGemeindeSchluessel(gemeinde)) {
            throw new Error("invalid AGR Gemeinde string");
        }
        return gemeinde;
    }

    private static isGemeindeSchluessel(gemeinde: string): gemeinde is GemeindeSchluessel {
        return /^[0-9]{3}$/.test(gemeinde);
    }
}