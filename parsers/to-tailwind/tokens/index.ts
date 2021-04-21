export * from './color';
export * from './gradient';
export * from './shadow';
export * from './textStyle';
export * from './opacity';
export * from './depth';
export * from './duration';
export * from './border';
export * from './measurement';

export abstract class Utils {
  static parseFloatIfString(value: string | number) {
    return typeof value === 'string' ? parseFloat(value) : value;
  }

  static sortObject(obj: Record<string, string | number>) {
    return Object.entries(obj)
      .sort(([, a], [, b]) => this.parseFloatIfString(a) - this.parseFloatIfString(b))
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }

  static deduplicateAndSortList(list: Array<string | number>) {
    return [...new Set(list)].sort(
      (a, b) => this.parseFloatIfString(a) - this.parseFloatIfString(b),
    );
  }
}
