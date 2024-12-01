/* eslint-disable @typescript-eslint/naming-convention */

import { DependencyContainer } from "tsyringe";
import * as fs from "fs";
import * as path from "path";

// SPT types
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";;
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt/models/eft/common/tables/ITrader";
import { ITraderConfig, IUpdateTime } from "@spt/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import type { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { CustomHideoutCraftService } from "./CustomHideoutCraftService";
import type { ItemHelper } from "@spt/helpers/ItemHelper";

import { WTTInstanceManager } from "./WTTInstanceManager";
import { CustomItemService } from "./CustomItemService";

import * as modConfig from "../config/mod_config.json";

// New trader settings
import * as baseJson from "../db/base.json";
import { Traders } from "@spt/models/enums/Traders";
import * as assortJson from "../db/assort.json";
import { CustomProfileEdition } from "./CustomProfileEdition";

class SampleTrader implements IPreSptLoadMod, IPostDBLoadMod {
    mod: string
    logger: ILogger
    private configServer: ConfigServer;
    private ragfairConfig: IRagfairConfig; 
    
    //Groovey said it was okay
    private Instance: WTTInstanceManager = new WTTInstanceManager();
    private customItemService: CustomItemService = new CustomItemService();
    private customHideoutCraftService: CustomHideoutCraftService = new CustomHideoutCraftService();
    private customProfileEdition: CustomProfileEdition = new CustomProfileEdition();
    private itemHelper: ItemHelper;
    private version: string;
    private modName = "Haven Industries - Chloe";
    private config;
    
    debug = false;

    public preSptLoad(container: DependencyContainer): void 
    {
        this.Instance.preSptLoad(container, this.modName);
        this.Instance.debug = this.debug;
        const PreSptModLoader: PreSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        this.itemHelper = container.resolve<ItemHelper>("ItemHelper");
        
        this.getVersionFromJson();
        //this.displayCreditBanner();

        this.registerProfileImage(PreSptModLoader, imageRouter);
        Traders[baseJson._id] = baseJson._id
        this.setupTraderUpdateTime(traderConfig);
        this.customItemService.preSptLoad(this.Instance);

        this.customHideoutCraftService.preSptLoad(this.Instance);
        this.customProfileEdition.preSptLoad(this.Instance);
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        this.Instance.postDBLoad(container);
        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes.RAGFAIR);
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const tables = databaseServer.getTables();
        const restrInRaid = tables.globals.config.RestrictionsInRaid;

        this.addTraderToDb(baseJson, tables, jsonUtil);
        this.customItemService.postDBLoad();
        this.createCase(tables);

        this.addTraderToLocales(tables, baseJson.name, "Chloe", baseJson.nickname, baseJson.location, "The well loved Receptionist at the Cultist Hideout, Chloe is always ruthless in her pursuit of the best deals as she deals with anyone regardless.");
        this.ragfairConfig.traders[baseJson._id] = true;
        this.customHideoutCraftService.postDBLoad(container);
        this.customProfileEdition.postDBLoad(container);
        
        this.adjustItemProperties(tables.templates.items);
        this.setLabsCardInRaidLimit(restrInRaid, 9);
    }

    private registerProfileImage(PreSptModLoader: PreSptModLoader, imageRouter: ImageRouter): void
    {
        const imageFilepath = `./${PreSptModLoader.getModPath(this.modName)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".png", ""), `${imageFilepath}/Chloe.png`);
    }

    private setupTraderUpdateTime(traderConfig: ITraderConfig): void
    {
        const traderRefreshRecord: IUpdateTime = {
            traderId: baseJson._id,
            seconds: {min: 3000, max: 9000},
        };
        traderConfig.updateTime.push(traderRefreshRecord);
    }

    private addTraderToDb(Chloe: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void
    {
        tables.traders[Chloe._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort,
            base: jsonUtil.deserialize(jsonUtil.serialize(Chloe)) as ITraderBase,
            questassort: {
                started: {},
                success: {
                    // Ammo bouta loose it - Part 1
                    "67369e25703137899bde3516": "6736a0c281826fba6328d450",
                    "67369e2c3752f9d498bc6d47": "6736a0c281826fba6328d450",
                    "67369e2e1439af1a07ada9e4": "6736a0c281826fba6328d450",
                    "67369e2f0358c16459ae7144": "6736a0c281826fba6328d450",
                    "67369e31402dd3f343248790": "6736a0c281826fba6328d450",
                    // Ammo bouta loose it - Part 2
                    "6737c949570dfde9b4a78826": "6737d4a368e31f47b40ba27e",
                    "6737cbea2bc75941f0c42cd9": "6737d4a368e31f47b40ba27e",
                    "6737ce5c04549e407ef6d695": "6737d4a368e31f47b40ba27e",
                    "6737d001eba96afade1c9a26": "6737d4a368e31f47b40ba27e",
                    "6737d0459fac8271d9987f76": "6737d4a368e31f47b40ba27e"
                },
                fail: {}
            }
        };
    }

    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string,)
    {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setLabsCardInRaidLimit(restrInRaid:any, limitAmount:number):void{
        if (restrInRaid === undefined) return

        //restrInRaid type set to any to shut the linter up because the type doesn't include MaxIn... props
        //set labs access card limit in raid to 9 so the keycard case can be filled while on pmc
        for (const restr in restrInRaid){
            const thisRestriction = restrInRaid[restr]
            if (thisRestriction.TemplateId === "5c94bbff86f7747ee735c08f"){
                thisRestriction.MaxInLobby = limitAmount;
                thisRestriction.MaxInRaid = limitAmount;
            }
        }
    }

    adjustItemProperties(dbItems: Record<string, ITemplateItem>){
        for (const [_, item] of Object.entries(dbItems)){
            // Skip anything that isn't specifically an Item type item
            if (item._type !== "Item")
            {
                continue;
            }

            const itemProps = item._props

            // Adjust key specific properties
            if (this.itemHelper.isOfBaseclass(item._id, BaseClasses.KEY)){

                if (modConfig.weightless_keys){
                    itemProps.Weight = 0.0;
                }

                itemProps.InsuranceDisabled = !modConfig.key_insurance_enabled;

                // If keys are to be set to no limit, and we're either not using the finite keys list, or this key doesn't exist
                // in it, set the key max usage to 0 (infinite)
                if (modConfig.no_key_use_limit && 
                    (!modConfig.use_finite_keys_list || !modConfig.finite_keys_list.includes(item._id)))
                {
                    itemProps.MaximumNumberOfUsage = 0;
                }
                
                if (modConfig.keys_are_discardable){
                    itemProps.DiscardLimit = -1
                }
            }

            // Remove keys from secure container exclude filter
            if (modConfig.all_keys_in_secure && this.itemHelper.isOfBaseclass(item._id, BaseClasses.MOB_CONTAINER) && itemProps?.Grids) {
                // Theta container has multiple grids, so we need to loop through all grids
                for (const grid of itemProps.Grids) {
                    const filter = grid?._props?.filters[0];
                    if (filter)
                    {
                        // Exclude items with a base class of KEY. Have to check that it's an "Item" type first because isOfBaseClass only accepts Items
                        filter.ExcludedFilter = filter.ExcludedFilter.filter(
                            itemTpl => this.itemHelper.getItem(itemTpl)[1]?._type !== "Item" || !this.itemHelper.isOfBaseclass(itemTpl, BaseClasses.KEY)
                        );
                    }
                }
            }
        }
    }

    createCase(tables){
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let item: any;

        //allow in secure containers, backpacks, other specific items per the config
        this.allowIntoContainers(
            "67275288cb2d8dae08bc9fbe",
            tables.templates.items
        );
        this.allowIntoContainers(
            "673e9ea1af35889366e815b9",
            tables.templates.items
        );
    }

    allowIntoContainers(itemID: string, items: Record<string, ITemplateItem>): void {
        for (const [_, item] of Object.entries(items)) {
            if (item && item._type === "Item") {
                this.allowIntoCaseByParent(itemID, "include", item, BaseClasses.MOB_CONTAINER);
            }
        }
    }

    allowIntoCaseByParent(customItemID, include, currentItem, caseParent): void {
        if (modConfig.enableSecureCase){
            if (include === "include"){
                if (currentItem._parent === caseParent && currentItem._id !== "5c0a794586f77461c458f892"){
                    for (const grid of currentItem._props.Grids) {
                        if (grid._props.filters[0].Filter === undefined){
                            grid._props.filters[0].Filter = [customItemID];
                        } else {
                            grid._props.filters[0].Filter.push(customItemID)
                        }
                    }
                }
            }
        }
    }

    private getVersionFromJson(): void 
    {
        const packageJsonPath = path.join(__dirname, "../package.json");

        fs.readFile(packageJsonPath, "utf-8", (err, data) => 
        {
            if (err) 
            {
                console.error("Error reading file:", err);
                return;
            }

            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }

    public colorLog(message: string, color: string) {
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
        const colorCode = colorCodes[color as keyof typeof colorCodes] || "\x1b[37m"; // Default to white if color is invalid.
        console.log(`${colorCode}${message}${resetCode}`); // Log the colored message here
    }

    private displayCreditBanner(): void 
    {
        this.colorLog(`[${this.modName}]           _______           _______  _       `, "brightMagenta");
        this.colorLog(`[${this.modName}] |\\     /|(  ___  )|\\     /|(  ____ \\( (    /|`, "brightMagenta");
        this.colorLog(`[${this.modName}] | )   ( || (   ) || )   ( || (    \\/|  \\  ( |`, "brightMagenta");
        this.colorLog(`[${this.modName}] | (___) || (___) || |   | || (__    |   \\ | |`, "brightMagenta");
        this.colorLog(`[${this.modName}] |  ___  ||  ___  |( (   ) )|  __)   | (\\ \\) |`, "brightMagenta");
        this.colorLog(`[${this.modName}] | (   ) || (   ) | \\ \\_/ / | (      | | \\   |`, "brightMagenta");
        this.colorLog(`[${this.modName}] | )   ( || )   ( |  \\   /  | (____/\\| )  \\  |`, "brightMagenta");
        this.colorLog(`[${this.modName}] |/     \\||/     \\|   \\_/   (_______/|/    \\_)`, "brightMagenta");
        this.colorLog(`[${this.modName}]                                             `, "brightMagenta");
    }
}
module.exports = { mod: new SampleTrader() }