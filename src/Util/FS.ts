/**
 * A simple method to easily import files that have a default export.
 * 
 * @param path - The path to the file.
 */
export async function defaultImport<T>(path: string): Promise<T> {
    return (await import(path))?.default
}