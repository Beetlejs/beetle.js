import { EntityType } from "./entity-type";

export class NavigationProperty {

    constructor(public readonly owner: EntityType, public readonly name: string,
                public readonly typeName: string) {
    }
    
    private _type: EntityType;
    get type() {
        return this._type
            ? this._type
            : (this._type = this.owner.metadata.getType(this.typeName));
    }
    isScalar: boolean = true;
    foreignKeyNames: string[] = [];
    associationName: string;

    private _inverse: NavigationProperty;
    get inverse(): NavigationProperty {
        if (this._inverse !== void 0) return this._inverse;
        
        for (let np of this.type.navigationProperties.values()) {
            if (np.type === this.owner && this.associationName === np.associationName)
                return (this._inverse = np);
        }
    }
}
