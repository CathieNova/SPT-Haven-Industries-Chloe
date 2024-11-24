/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { WTTInstanceManager } from "./WTTInstanceManager";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import * as fs from "fs";
import * as path from "path";

export class CustomHideoutCraftService {
    private Instance: WTTInstanceManager;

    constructor() {}

    public preSptLoad(Instance: WTTInstanceManager): void {
        this.Instance = Instance;
    }

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = this.Instance.database;
        const hideoutProduction = db.hideout.production.recipes;
        var count = 0;

        const hideoutCraftsDir = path.resolve(__dirname, "../db/hideoutCrafts");

        if (!fs.existsSync(hideoutCraftsDir)) return;

        const files = fs.readdirSync(hideoutCraftsDir);

        if (!files || files.length === 0) return;

        for (const file of files) {
            const filePath = path.join(hideoutCraftsDir, file);

            if (path.extname(filePath) !== ".json") continue;

            const crafts = this.Instance.jsonUtil.deserialize(fs.readFileSync(filePath, "utf-8"));

            if (!crafts || !Array.isArray(crafts)) continue;

            for (const craft of crafts) {
                if (!craft || hideoutProduction.some((p) => p._id === craft._id)) continue;

                hideoutProduction.push(craft);
            }
        }
        
        logger.log(`[Haven Industries - Chloe] Added ${count} custom Hideout Crafts.`, "magenta");
    }
}
