"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomProfileEdition = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class CustomProfileEdition {
    Instance;
    constructor() { }
    preSptLoad(Instance) {
        this.Instance = Instance;
    }
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const profilesPath = (0, path_1.join)(__dirname, "../db/profileEditions");
        const profileFolders = (0, fs_1.readdirSync)(profilesPath).filter(folder => (0, fs_1.statSync)((0, path_1.join)(profilesPath, folder)).isDirectory());
        profileFolders.forEach(folder => {
            const infoPath = (0, path_1.join)(profilesPath, folder, "info.json");
            if (!this.fileExists(infoPath)) {
                logger.error(`[Haven Industries - Chloe] Missing info.json in ${folder}. Skipping profile.`);
                return;
            }
            const profileInfo = JSON.parse((0, fs_1.readFileSync)(infoPath, "utf-8"));
            if (profileInfo.enabled) {
                this.addProfile(tables, logger, profileInfo.name, folder, profileInfo.copyEdition, profileInfo.gameVersion);
            }
        });
    }
    addProfile(tables, logger, profileName, folder, copyEdition, gameVersion) {
        const templateProfile = tables.templates.profiles[copyEdition];
        const newProfile = JSON.parse(JSON.stringify(templateProfile));
        const profilePath = (0, path_1.join)(__dirname, "../db/profileEditions", folder);
        const bearInventoryData = this.loadJSON((0, path_1.join)(profilePath, "bear_inventory.json"));
        const usecInventoryData = this.loadJSON((0, path_1.join)(profilePath, "usec_inventory.json"));
        const traderStanding = this.loadJSON((0, path_1.join)(profilePath, "traders.json"));
        const description = this.loadJSON((0, path_1.join)(profilePath, "descLocale.json"));
        const skills = this.loadJSON((0, path_1.join)(profilePath, "skills.json"));
        const quests = this.loadJSON((0, path_1.join)(profilePath, "quests.json"));
        const bonuses = this.loadJSON((0, path_1.join)(profilePath, "bonuses.json"));
        const hideout = this.loadJSON((0, path_1.join)(profilePath, "hideout.json"));
        newProfile.usec.character.Inventory = usecInventoryData;
        newProfile.bear.character.Inventory = bearInventoryData;
        newProfile.usec.trader = traderStanding;
        newProfile.bear.trader = traderStanding;
        newProfile.descriptionLocaleKey = description;
        newProfile.usec.character.Skills = skills;
        newProfile.bear.character.Skills = skills;
        newProfile.quests = quests;
        newProfile.usec.character.Bonuses = bonuses;
        newProfile.bear.character.Bonuses = bonuses;
        newProfile.usec.character.Hideout = hideout;
        newProfile.bear.character.Hideout = hideout;
        newProfile.usec.character.Info.GameVersion = gameVersion;
        newProfile.bear.character.Info.GameVersion = gameVersion;
        tables.templates.profiles[profileName] = newProfile;
        logger.log(`[Haven Industries - Chloe] Added ${profileName} profile.`, "magenta");
    }
    loadJSON(filePath) {
        if (!this.fileExists(filePath))
            return {};
        return JSON.parse((0, fs_1.readFileSync)(filePath, "utf-8"));
    }
    fileExists(path) {
        try {
            return (0, fs_1.statSync)(path).isFile();
        }
        catch {
            return false;
        }
    }
}
exports.CustomProfileEdition = CustomProfileEdition;
//# sourceMappingURL=CustomProfileEdition.js.map