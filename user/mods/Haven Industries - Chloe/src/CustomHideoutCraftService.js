"use strict";
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
exports.CustomHideoutCraftService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class CustomHideoutCraftService {
    Instance;
    constructor() { }
    preSptLoad(Instance) {
        this.Instance = Instance;
    }
    postDBLoad() {
        const db = this.Instance.database;
        const hideoutProduction = db.hideout.production.recipes;
        const hideoutCraftsDir = path.resolve(__dirname, "../db/hideoutCrafts");
        if (!fs.existsSync(hideoutCraftsDir))
            return;
        const files = fs.readdirSync(hideoutCraftsDir);
        if (!files || files.length === 0)
            return;
        for (const file of files) {
            const filePath = path.join(hideoutCraftsDir, file);
            if (path.extname(filePath) !== ".json")
                continue;
            const crafts = this.Instance.jsonUtil.deserialize(fs.readFileSync(filePath, "utf-8"));
            if (!crafts || !Array.isArray(crafts))
                continue;
            for (const craft of crafts) {
                if (!craft || hideoutProduction.some((p) => p._id === craft._id))
                    continue;
                hideoutProduction.push(craft);
            }
        }
    }
}
exports.CustomHideoutCraftService = CustomHideoutCraftService;
//# sourceMappingURL=CustomHideoutCraftService.js.map