import AWS from 'aws-sdk';

const client = new AWS.SecretsManager({
    region: 'eu-west-1'
});

export async function getSecret() {
    const { SecretString } = await client.getSecretValue({
        SecretId: 'REACT_APP_TEST_SECRET',
    }).promise();

    return SecretString;
}