export type BundeslandSchluessel =
    "01" |
    "02" |
    "03" |
    "04" |
    "05" |
    "06" |
    "07" |
    "08" |
    "09" |
    "10" |
    "11" |
    "12" |
    "13" |
    "14" |
    "15" |
    "16"

export type RegierungsbezirkSchluessel = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
export type KreisSchluessel = string
export type VerbandSchluessel = string
export type GemeindeSchluessel = string

export enum Verbandstyp {
    VerbandsfreieGemeinde = "0",
    VerbandsangehoerigeGemeinde = "5",
    GemeindefreiesGebiet = "9"
}