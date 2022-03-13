export const enum AdapterType {
  IQAIR_DAILY = 'IQAIR_DAILY',
  MOCK = 'MOCK',
}

/**
 * Utility class to get a list of values
 *
 * "const" Enums (like AdapterType) can only be used in property
 * or index access expressions or the right hand side of an
 * import declaration or export assignment or type query.ts(2475)
 */
export class AdapterTypes {
  public static getAll(): Array<AdapterType> {
    return [AdapterType.IQAIR_DAILY, AdapterType.MOCK];
  }
}
