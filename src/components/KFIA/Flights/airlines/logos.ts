// app/lib/airlines/logos.ts
export class AirlineLogos {
  /** Where the files live under /public (we'll try all of these) */
  static basePaths = ["/-/media/Project/Daco Digital Channels/KFIA/airlines"];

  /** Extensions to try (order matters) — include SVG */
  static exts = ["svg", "SVG", "png", "PNG", "jpg", "JPG", "jpeg"];

  /** IATA → normalized filename prefix kept in /public/... */
  static iataToPrefix: Record<string, string> = {
    A3: "AEE",
    SM: "MSC",
    IF: "FBA",
    IA: "IAW",
    NP: "NIA",
    SV: "SVA",
    UL: "ALK",
    PF: "SIF",
    "6E": "IGO",
    MS: "MSR",
    F3: "FAD",
    ET: "ETH",
    PC: "PGT",
    MU: "CES",
    G9: "ABY",
    OV: "OM",
    MK: "MAU",
    "3T": "TRQ",
    XY: "KNE",
    FZ: "FDB",
    EK: "UAE",
    EY: "ETD",
    WY: "OMA",
    GF: "GFA",
    GA: "GIA",
    KU: "KAC",
    ME: "MEA",
    RJ: "RJA",
    J9: "JZR",
    OQ: "SIF",
    W6: "WZZ",
    W4: "WMT",
    QR: "QTR",
    TK: "THY",
    BA: "BAW",
    AF: "AFR",
    KL: "KLM",
    LH: "DLH",
    DL: "DAL",
    AC: "ACA",
    UA: "UAL",
    PK: "PIA",
    AI: "AIC",
    IX: "AXB",
    NH: "ANA",
    VS: "VIR",
    QF: "QFA",
    PR: "PAL",
    BI: "BBC",
    AZ: "AZA",
    J2: "AHY",

    // ✅ NEW ENTRIES
    KQ: "KQA", // Kenya Airways
    H9: "HIM", // Himalaya Airlines
    "9P": "FJL", // Fly Jinnah (IATA)
    FJL: "FJL",  // Fly Jinnah (ICAO)
    RX: "RXI",   // RX 2030 → RXI.jpg
    BG: "BBC",   // BG 3050 → BBC.jpg

    // ✅ ADDITIONAL FROM LOGO FOLDER
    ABY: "ABY",
    ACA: "ACA",
    AFR: "AFR",
    AHY: "AHY",
    AIC: "AIC",
    ALK: "ALK",
    ANA: "ANA",
    AXB: "AXB",
    AZA: "AZA",
    AZG: "AZG",
    BBC: "BBC",
    CES: "CES",
    DA: "DA",
    DAL: "DAL",
    DLH: "DLH",
    ETD: "ETD",
    ETH: "ETH",
    FAD: "FAD",
    FBA: "FBA",
    FDB: "FDB",
    GEA: "GEA",
    GFA: "GFA",
    GIA: "GIA",
    GOW: "GOW",
    HIM: "HIM",
    IAW: "IAW",
    IGO: "IGO",
    IRA: "IRA",
    JZR: "JZR",
    KAC: "KAC",
    KLM: "KLM",
    KNE: "KNE",
    KQA: "KQA",
    MAU: "MAU",
    MEA: "MEA",
    MSC: "MSC",
    MSR: "MSR",
    NIA: "NIA",
    NMA: "NMA",
    OM: "OM",
    OMA: "OMA",
    PAL: "PAL",
    PGT: "PGT",
    PIA: "PIA",
    QFA: "QFA",
    QTR: "QTR",
    RBG: "RBG",
    RJA: "RJA",
    RNA: "RNA",
    RXI: "RXI",
    SIF: "SIF",
    SVA: "SVA",
    SYR: "SYR",
    THY: "THY",
    TKJ: "TKJ",
    TRQ: "TRQ",
    UAE: "UAE",
    UAL: "UAL",
    VDA: "VDA",
    VIR: "VIR",
    VTI: "VTI",
    WAZ: "WAZ",
    WMT: "WMT",
    WZZ: "WZZ",
  };

  /** Extract IATA from "SV 1141" */
  static iataFromFlightNo(flightNo: string): string {
    const m = flightNo.trim().match(/^([A-Z0-9]{1,3})/i);
    return (m?.[1] ?? "").toUpperCase();
  }

  /** If API gave "GFA-20.08.2024-…" return "GFA" (for extra fallback) */
  static prefixFromApiFilename(name: string): string | null {
    const m = name.match(/^([A-Z0-9]{2,4})[-_.]/i);
    return m ? m[1].toUpperCase() : null;
  }

  /** Build candidate URL list in priority order for a given row-like object */
  static candidates(args: { flightNo: string; airlineLogo?: string }): string[] {
    const out: string[] = [];

    const pushIfNew = (s: string) => {
      if (!out.includes(s)) out.push(s);
    };

    const pushAll = (prefix: string) => {
      for (const base of this.basePaths) {
        for (const ext of this.exts) {
          pushIfNew(`${base}/${prefix}.${ext}`);
        }
      }
    };

    // 1) Explicit logo path or prefix
    if (args.airlineLogo) {
      const raw = args.airlineLogo.trim();
      if (/\.[a-zA-Z0-9]+$/.test(raw)) {
        pushIfNew(raw.startsWith("/") ? raw : `${this.basePaths[0]}/${raw}`);
      } else {
        pushAll(raw);
      }

      // Also try prefix from API filename if available
      const apiPrefix = this.prefixFromApiFilename(raw);
      if (apiPrefix) pushAll(apiPrefix);
    }

    // 2) IATA → mapped prefix
    const iata = this.iataFromFlightNo(args.flightNo);
    const mapped = this.iataToPrefix[iata];
    if (mapped) pushAll(mapped);
    if (iata) pushAll(iata); // fallback

    return out;
  }
}