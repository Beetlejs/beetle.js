import { EntityType } from "./entity-type";

export class DataProperty {

    constructor(public readonly owner: EntityType, public readonly name: string) {
    }
    
    defaultValue: any;
}

export class DataPropertyBuilder {

    constructor(public readonly property: DataProperty) {
    }

    keyPart() {
        if (!~this.property.owner.keys.indexOf(this.property.name)) return;

        this.property.owner.keys.push(this.property.name);
    }
}