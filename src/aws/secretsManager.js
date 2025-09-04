const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const DB_CONNECTION_STRING_NAME = "n11280559_13_connection_string_db";

async function GetSecretValue(secretName) {
    const client = new SecretsManagerClient({ region: "ap-southeast-2" });

    try {
        const response = await client.send(
            new GetSecretValueCommand({ SecretId: secretName })
        );

        if (response.SecretString) {
            const secret = JSON.parse(response.SecretString);
            console.log("Logging secret");
            console.log(secret);
            return secret; 
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { GetSecretValue, DB_CONNECTION_STRING_NAME };
