/**
 * @file store
 * @summary use application state management in memory
 */
let store = {};

/**
 * save object into store
 * @param key
 * @param value
 */
const save = (key, value) => {
    store[key] = value;
}

/**
 * get value from store
 * @param key
 * @return {*}
 */
const get = (key) => {
    return store[key];
}

export const saveDataBricksClient = (client) => {
    save('DATABRICKS_CLIENT', client);
}

export const getDatabricksClient = () => {
    return get('DATABRICKS_CLIENT');
}

export const saveAzureServiceBusClient = (sender) => {
    save('AZURE_SERVICE_BUS_CLIENT', sender);
}

export const saveAzureBlobStorageClient = (sender) => {
    save('AZURE_BLOB_STORAGE_CLIENT', sender);
}

/**
 * get azure service bus client
 * @returns {ServiceBusClient}
 */
export const getAzureServiceBusClient = () => {
    return get('AZURE_SERVICE_BUS_CLIENT');
}

/**
 * get azure blobl storage client
 * @returns {ServiceBusClient}
 */
export const getAzureBlobStorageClient = () => {
    return get('AZURE_BLOB_STORAGE_CLIENT');
}

export const saveCommandFormatEmbeddings = (embeddings) => {
    save('CMD_EMBEDDING', embeddings);
}

export const getCommandFormatEmbeddings = () => {
    return get('CMD_EMBEDDING');
}

export const saveHotels = (hotels) => {
    save("HOTELS_LIST", hotels);
}

export const getHotels = () => {
    return get('HOTELS_LIST');
}

export const saveDatabricksTableSchemas = (schemaDescription) => {
    save('DATABRICKS_SCHEMA', schemaDescription);
}

export const getDatabricksTableSchemas = () => {
    return get('DATABRICKS_SCHEMA');
}

export const saveDatabricksColumnNames = (columns) => {
    save('DATABRICKS_COLUMN_NAMES', columns);
}

export const getDatabricksColumnNames = () => {
    return get('DATABRICKS_COLUMN_NAMES');
}
