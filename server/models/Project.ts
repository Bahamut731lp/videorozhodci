import * as path from "https://deno.land/std@0.188.0/path/mod.ts";

class Project {
    static getRoot() {
        return Deno.env.get("PROJECTS_DIRECTORY") ?? ".";
    }

    /**
     * Funkce převede vstup na řetězec použitelný k vytvoření složky
     * @param input Nenormalizovaný string
     * @returns String použitelný k vytvoření složky
     */
    static getValidName(input: string) {
        return input
        .toLowerCase()
        .replace(/\s+/gmi, "_")
        .normalize('NFKD')
        .replace(/[^\w]/g, '');
    }

    /**
     * Funkce kontroluje, jestli adresář ve složce projektů existuje
     * @param name Jméno adresáře
     * @returns Jestli adresář existuje ve složce projektů
     */
    static async checkIfDirExists(name: string) {
        try {
            await Deno.stat(path.join(this.getRoot(), name));
            return true;
    
        } catch (_) {
            return false;
        }
    }

    /**
     * Funkce vytvoří projekt
     * @param name Jméno projektu zadané uživatelem
     * @returns HTTP status kód
     */
    static async create(name: string) {
        const validName = this.getValidName(name);
        const projectPath = path.join(this.getRoot(), validName);

        // Pokud projekt již existuje, vracíme HTTP status konfliktu
        if (await this.checkIfDirExists(validName)) return {name: validName, status: 409};

        // Vytvoření nové složky s projektem
        await Deno.mkdir(projectPath, { recursive: true });

        const metadata = {
            name: name,
            directory: path.join(this.getRoot(), validName),
            streams: {}
        }

        // Vytvoření souboru s metadaty
        await Deno.writeTextFile(path.join(projectPath, ".metadata"), JSON.stringify(metadata, null, 4));

        return {name: validName, status: 200};
    }

    /**
     * Funkce pro metadat o projektu
     * @param name Název projektu (normalizovaný)
     */
    static async get(name: string) {
        // Kontrola, zda projekt existuje
        if (!(await this.checkIfDirExists(name))) return { name, status: 404 };
        const data = await Deno.readTextFile(path.join(this.getRoot(), name, ".metadata"));
        const json = JSON.parse(data);

        json.status = 200;

        return json;
    }
}

export default Project;