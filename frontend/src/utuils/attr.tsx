export const attr = (condition: boolean, name: string, value: any = "") =>
    condition ? { [name]: value } : {};