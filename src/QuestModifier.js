"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestModifier = void 0;
class QuestModifier {
    /**
     * Modify the quests in the given tables using the provided JSON utility.
     *
     * @param {IDatabaseTables} tables - the tables containing the quests
     * @param {JsonUtil} jsonUtil - the JSON utility for cloning objects
     * @return {void}
     */
    modifyQuests(tables, jsonUtil, debug) {
        // Define new SVDs
        const newSVDs = [
            "6657bc8faeddd6b0a9b40224",
            "6657bd4d3a4d6e7c33fd2fdc"
        ];
        // Get the specific quest
        const punisher6 = tables.templates.quests["59ca2eb686f77445a80ed049"];
        if (punisher6) {
            // Extract existing SVDs
            const existingPunisher6SVDs = punisher6.conditions.AvailableForFinish[0].counter.conditions[0].weapon;
            try {
                // Clone the existing pistols array
                const updatedSVDs = jsonUtil.clone(existingPunisher6SVDs);
                let modified = false;
                // Add new SVDs if they do not already exist
                for (const SVD of newSVDs) {
                    if (!updatedSVDs.includes(SVD)) {
                        updatedSVDs.push(SVD);
                        modified = true;
                        if (debug) {
                            console.log("Added new SVD:", SVD);
                        }
                    }
                    else {
                        if (debug) {
                            console.log("SVD already exists:", SVD);
                        }
                    }
                }
                // Only update the quest if modifications were made
                if (modified) {
                    punisher6.conditions.AvailableForFinish[0].counter.conditions[0].weapon = updatedSVDs;
                    if (debug) {
                        console.log("Modified quest:", punisher6.conditions.AvailableForFinish[0].counter.conditions[0].weapon);
                    }
                }
            }
            catch (error) {
                console.error("Error modifying quests:", error);
            }
        }
    }
}
exports.QuestModifier = QuestModifier;
//# sourceMappingURL=QuestModifier.js.map