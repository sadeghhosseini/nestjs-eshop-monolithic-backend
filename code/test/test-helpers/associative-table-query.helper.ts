import { getConnection, getManager } from "typeorm";

interface Metadata {
    tableName: string,
    foreignKeyEntityMaps: Array<{ foreignKey: string, referencedEntity: any }>
}
const extractMetadata = (RelationClass1, RelationClass2): Metadata => {
    const metadata = getConnection().getMetadata(RelationClass1);
    const relation = metadata.manyToManyRelations.filter(d => d.type === RelationClass2)[0];
    const junctionTableName = relation.joinTableName;//for Product/Property = products_properties
    // const propertyNameInEntity = relation.propertyName;//for Product = properties
    let mapForEntity1 = relation.joinColumns.map(d => ({
        foreignKey: d.databaseName,
        referencedEntity: d.referencedColumn.target,
    }));
    let mapForEntity2 = relation.inverseJoinColumns.map(d => ({
        foreignKey: d.databaseName,
        referencedEntity: d.referencedColumn.target,
    }));

    return {
        tableName: junctionTableName,
        foreignKeyEntityMaps: [
            ...mapForEntity1,
            ...mapForEntity2,
        ],
    }
}

const getRelationMetadata = (Class1, Class2) => {
    const result = extractMetadata(Class1, Class2);
    if (result?.tableName) {
        return result;
    } else {
        return extractMetadata(Class2, Class1)
    }
}

export const getAssociativeRecords = (
    RelationClassThatHasJoinTable,
    OtherRelationclass,
    where?: { EntityClassRelatedToForeignKey: any, foreignKey: number }
) => {
    const metadata = getRelationMetadata(RelationClassThatHasJoinTable, OtherRelationclass);
    let query = `select * from ${metadata.tableName}`;
    if (where) {
        const foreignKeyName = metadata.foreignKeyEntityMaps.filter(d => d.referencedEntity === where.EntityClassRelatedToForeignKey)[0].foreignKey;
        query += ` where ${foreignKeyName} = ${where.foreignKey}`;
    }
    return getManager().query(query);
}