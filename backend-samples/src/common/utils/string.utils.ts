export class StringUtils {
  /**
   * Capitalizes first letter and convert the rest to lowercase.
   */
  static capitalizeOnlyFirstLetter(s: string): string {
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
  }

  /**
   * Capitalizes first letter and leaves the rest as-is.
   */
  static capitalize(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }

  /**
   * Capitalizes first letter of every word.
   */
  static toTitleCase(phrase: string): string {
    return phrase
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
