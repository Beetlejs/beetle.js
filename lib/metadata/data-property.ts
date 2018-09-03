import { EntityType } from "./entity-type";

export class DataProperty {

    constructor(public readonly owner: EntityType, public readonly name: string) {
    }
    
    defaultValue: any;
}
