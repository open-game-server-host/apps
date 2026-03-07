import childProcess from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

console.log();
console.log("Bundling apps");

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

console.log();
console.log(`Bundling startup files`);

rmSync("output/startup_files", { recursive: true, force: true });
mkdirSync("output/startup_files");

for (const appId of readdirSync("apps")) {
    if (!lstatSync(`apps/${appId}`).isDirectory()) {
        continue;
    }

    for (const variantId of readdirSync(`apps/${appId}`)) {
        if (variantId === "startup_files") {
            continue;
        }
        if (!lstatSync(`apps/${appId}/${variantId}`).isDirectory()) {
            continue;
        }
        
        const copyToFolder = `output/startup_files/${appId}/${variantId}`;
        mkdirSync(copyToFolder, { recursive: true });

        if (existsSync(`apps/${appId}/startup_files`)) {
            cpSync(`apps/${appId}/startup_files`, copyToFolder, { recursive: true });
        }

        if (existsSync(`apps/${appId}/${variantId}/startup_files`)) {
            cpSync(`apps/${appId}/${variantId}/startup_files`, copyToFolder, { recursive: true, force: true }); // Overwrites existing files
        }

        console.log(`  ${appId}/${variantId}`);
    }
}

const child = childProcess.exec("cd output/startup_files && tar cf ../startup_files.tar .");
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.on("exit", () => {
    console.log();
    console.log("Bundled startup files to output/startup_files.tar");
    console.log();
});