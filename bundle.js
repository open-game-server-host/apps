import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

function readJsonFile(path) {
    return JSON.parse(readFileSync(path).toString());
}

function parseApps() {
    const output = {};

    const appsPath = "apps";
    if (existsSync(appsPath)) {
        for (const appFile of readdirSync(appsPath)) {
            if (!appFile.endsWith(".json")) {
                continue;
            }
            const appId = appFile.substring(0, appFile.length - 5);
            console.log();
            console.log(appId);
            const appData = parseApp(appId);
            if (appData) {
                output[appId] = appData;
            }
        }
    }

    return output;
}

function parseApp(appId) {
    const data = readJsonFile(`apps/${appId}.json`);

    const variants = {};
    const variantsPath = `apps/${appId}`;
    if (existsSync(variantsPath)) {
        for (const variantFile of readdirSync(variantsPath)) {
            if (!variantFile.endsWith(".json")) {
                continue;
            }
            const variantId = variantFile.substring(0, variantFile.length - 5);
            console.log(`${appId}/${variantId}`);
            const variantData = parseVariant(appId, variantId);
            if (variantData) {
                variants[variantId] = variantData;
            }
        }
    }
    data.variants = variants;
    return data;
}

function parseVariant(appId, variantId) {
    const data = readJsonFile(`apps/${appId}/${variantId}.json`);

    const versions = {};
    const versionsPath = `apps/${appId}/${variantId}`;
    if (existsSync(versionsPath)) {
        for (const versionFile of readdirSync(versionsPath)) {
            if (!versionFile.endsWith(".json")) {
                continue;
            }
            const versionId = versionFile.substring(0, versionFile.length - 5);
            console.log(`${appId}/${variantId}/${versionId}`);
            const versionData = parseVersion(appId, variantId, versionId);
            if (versionData) {
                versions[versionId] = versionData;
            }
        }
    }
    data.versions = versions;
    return data;
}

function parseVersion(appId, variantId, versionId) {
    return readJsonFile(`apps/${appId}/${variantId}/${versionId}.json`);
}

writeFileSync("apps.json", JSON.stringify(parseApps()));