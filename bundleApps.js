import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

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

    const unsortedVariants = [];
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
                variantData.id = variantId;
                unsortedVariants.push(variantData);
                // variants[variantId] = variantData;
            }
        }
    }
    unsortedVariants.sort((a, b) => a.order - b.order).forEach(variant => {
        const { id } = variant;
        delete variant.id;
        variants[id] = variant;
    });
    data.variants = variants;
    return data;
}

function parseVariant(appId, variantId) {
    const data = readJsonFile(`apps/${appId}/${variantId}.json`);

    const unsortedVersions = [];
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
                versionData.id = versionId;
                unsortedVersions.push(versionData);
                // versions[versionId] = versionData;
            }
        }
    }
    unsortedVersions.sort((a, b) => a.order - b.order).forEach(version => {
        const { id } = version;
        delete version.id;
        versions[id] = version;
    });
    data.versions = versions;
    return data;
}

function parseVersion(appId, variantId, versionId) {
    return readJsonFile(`apps/${appId}/${variantId}/${versionId}.json`);
}

mkdirSync("output", { recursive: true });
writeFileSync("output/apps.json", JSON.stringify(parseApps()));
console.log();
console.log("Written apps.json");
console.log();