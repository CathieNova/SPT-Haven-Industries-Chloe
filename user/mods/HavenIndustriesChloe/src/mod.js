"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const CustomHideoutCraftService_1 = require("./CustomHideoutCraftService");
const WTTInstanceManager_1 = require("./WTTInstanceManager");
const CustomItemService_1 = require("./CustomItemService");
// New trader settings
const baseJson = __importStar(require("../db/base.json"));
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const assortJson = __importStar(require("../db/assort.json"));
const CustomProfileEdition_1 = require("./CustomProfileEdition");
class SampleTrader {
    mod;
    logger;
    configServer;
    ragfairConfig;
    //Groovey said it was okay
    Instance = new WTTInstanceManager_1.WTTInstanceManager();
    customItemService = new CustomItemService_1.CustomItemService();
    customHideoutCraftService = new CustomHideoutCraftService_1.CustomHideoutCraftService();
    customProfileEdition = new CustomProfileEdition_1.CustomProfileEdition();
    version;
    modName = "Haven Industries - Chloe";
    config;
    debug = false;
    preSptLoad(container) {
        this.Instance.preSptLoad(container, this.modName);
        this.Instance.debug = this.debug;
        const PreSptModLoader = container.resolve("PreSptModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        this.getVersionFromJson();
        this.displayCreditBanner();
        this.registerProfileImage(PreSptModLoader, imageRouter);
        Traders_1.Traders[baseJson._id] = baseJson._id;
        this.setupTraderUpdateTime(traderConfig);
        this.customItemService.preSptLoad(this.Instance);
        this.customHideoutCraftService.preSptLoad(this.Instance);
        this.customProfileEdition.preSptLoad(this.Instance);
    }
    postDBLoad(container) {
        this.Instance.postDBLoad(container);
        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const databaseServer = container.resolve("DatabaseServer");
        const jsonUtil = container.resolve("JsonUtil");
        const tables = databaseServer.getTables();
        this.addTraderToDb(baseJson, tables, jsonUtil);
        this.customItemService.postDBLoad();
        this.createCase(tables);
        this.addTraderToLocales(tables, baseJson.name, "Chloe", baseJson.nickname, baseJson.location, "The well loved Receptionist at the Cultist Hideout, Chloe is always ruthless in her pursuit of the best deals as she deals with anyone regardless.");
        this.ragfairConfig.traders[baseJson._id] = true;
        this.customHideoutCraftService.postDBLoad();
        this.customProfileEdition.postDBLoad(container);
    }
    registerProfileImage(PreSptModLoader, imageRouter) {
        const imageFilepath = `./${PreSptModLoader.getModPath(this.modName)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".png", ""), `${imageFilepath}/Chloe.png`);
    }
    setupTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = {
            traderId: baseJson._id,
            seconds: { min: 3000, max: 9000 },
        };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    addTraderToDb(Chloe, tables, jsonUtil) {
        tables.traders[Chloe._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)),
            base: jsonUtil.deserialize(jsonUtil.serialize(Chloe)),
            questassort: {
                started: {},
                success: {
                    "67369e25703137899bde3516": "6736a0c281826fba6328d450",
                    "67369e2c3752f9d498bc6d47": "6736a0c281826fba6328d450",
                    "67369e2e1439af1a07ada9e4": "6736a0c281826fba6328d450",
                    "67369e2f0358c16459ae7144": "6736a0c281826fba6328d450",
                    "67369e31402dd3f343248790": "6736a0c281826fba6328d450"
                },
                fail: {}
            }
        };
    }
    addTraderToLocales(tables, fullName, firstName, nickName, location, description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
    createCase(tables) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let item;
        //allow in secure containers, backpacks, other specific items per the config
        this.allowIntoContainers("67275288cb2d8dae08bc9fbe", tables.templates.items);
        this.allowIntoContainers("673e9ea1af35889366e815b9", tables.templates.items);
    }
    allowIntoContainers(itemID, items) {
        for (const [_, item] of Object.entries(items)) {
            if (item && item._type === "Item") {
                this.allowIntoCaseByParent(itemID, "include", item, BaseClasses_1.BaseClasses.MOB_CONTAINER);
            }
        }
    }
    allowIntoCaseByParent(customItemID, include, currentItem, caseParent) {
        if (include === "include") {
            if (currentItem._parent === caseParent && currentItem._id !== "5c0a794586f77461c458f892") {
                for (const grid of currentItem._props.Grids) {
                    if (grid._props.filters[0].Filter === undefined) {
                        grid._props.filters[0].Filter = [customItemID];
                    }
                    else {
                        grid._props.filters[0].Filter.push(customItemID);
                    }
                }
            }
        }
    }
    getVersionFromJson() {
        const packageJsonPath = path.join(__dirname, "../package.json");
        fs.readFile(packageJsonPath, "utf-8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }
    colorLog(message, color) {
        const colorCodes = {
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            gray: "\x1b[90m",
            brightRed: "\x1b[91m",
            brightGreen: "\x1b[92m",
            brightYellow: "\x1b[93m",
            brightBlue: "\x1b[94m",
            brightMagenta: "\x1b[95m",
            brightCyan: "\x1b[96m",
            brightWhite: "\x1b[97m"
        };
        const resetCode = "\x1b[0m";
        const colorCode = colorCodes[color] || "\x1b[37m"; // Default to white if color is invalid.
        console.log(`${colorCode}${message}${resetCode}`); // Log the colored message here
    }
    displayCreditBanner() {
        this.colorLog(`[${this.modName}] ██████████████████████████████████████████████████████████████████████`, "brightGreen");
        this.colorLog(`[${this.modName}]           _______           _______  _       `, "brightMagenta");
        this.colorLog(`[${this.modName}] |\\     /|(  ___  )|\\     /|(  ____ \\( (    /|`, "brightMagenta");
        this.colorLog(`[${this.modName}] | )   ( || (   ) || )   ( || (    \\/|  \\  ( |`, "brightMagenta");
        this.colorLog(`[${this.modName}] | (___) || (___) || |   | || (__    |   \\ | |`, "brightMagenta");
        this.colorLog(`[${this.modName}] |  ___  ||  ___  |( (   ) )|  __)   | (\\ \\) |`, "brightMagenta");
        this.colorLog(`[${this.modName}] | (   ) || (   ) | \\ \\_/ / | (      | | \\   |`, "brightMagenta");
        this.colorLog(`[${this.modName}] | )   ( || )   ( |  \\   /  | (____/\\| )  \\  |`, "brightMagenta");
        this.colorLog(`[${this.modName}] |/     \\||/     \\|   \\_/   (_______/|/    \\_)`, "brightMagenta");
        this.colorLog(`[${this.modName}]                                             `, "brightMagenta");
        this.colorLog(`[${this.modName}]   ------------------------------------------------------------------------`, "brightGreen");
        this.colorLog(`[${this.modName}]                   Alpha Development Build!         `, "brightYellow");
        this.colorLog(`[${this.modName}]   ------------------------------------------------------------------------`, "brightGreen");
        this.colorLog(`[${this.modName}] ██████████████████████████████████████████████████████████████████████`, "brightGreen");
    }
}
module.exports = { mod: new SampleTrader() };
//# sourceMappingURL=mod.js.map