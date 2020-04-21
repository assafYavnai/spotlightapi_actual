export function removeSqlErrorFields(err) {
    if(err.sql !=undefined){
        delete err.sql;
        delete err.fields;
        delete err.original;
        delete err.parent;
    }
    return err;
}