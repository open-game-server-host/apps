import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

rmSync("output/startup_files", { recursive: true, force: true });
mkdirSync("output/startup_files");

for (const appFolder of readdirSync("apps")) {
    if (!lstatSync(`apps/${appFolder}`).isDirectory()) {
        continue;
    }
    console.log(`checking apps/${appFolder}`);
    for (const appFile of readdirSync(`apps/${appFolder}`)) {
        if (appFile === "startup_files") {
            console.log(`  copying apps/${appFolder}/startup_files`);
            const copyToFolder = `output/startup_files/${appFolder}`;
            mkdirSync(copyToFolder, { recursive: true });
            cpSync(`apps/${appFolder}/startup_files`, copyToFolder, { recursive: true });
            continue;
        }

        if (lstatSync(`apps/${appFolder}/${appFile}`).isDirectory()) {
            if (existsSync(`apps/${appFolder}/${appFile}/startup_files`)) {
                console.log(`  copying apps/${appFolder}/${appFile}/startup_files`);
                const copyToFolder = `output/startup_files/${appFolder}/${appFile}/startup_files`;
                mkdirSync(copyToFolder, { recursive: true });
                cpSync(`apps/${appFolder}/${appFile}/startup_files`, copyToFolder, { recursive: true });
            }
        }
    }
}

console.log();
console.log("Bundled startup files to output/startup_files");
console.log();