import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {fromIni} from '@aws-sdk/credential-provider-ini';

export async function exec(config: any) {
	var secretsmanager: SecretsManagerClient | null = null;
	if (config.ClientConfig) {
		secretsmanager = new SecretsManagerClient(config.ClientConfig);
	} else if (config.AWSProfile) {
		secretsmanager = new SecretsManagerClient({
			credentials: fromIni({profile: config.AWSProfile}),
		});
	} else {
		secretsmanager = new SecretsManagerClient();
	}
	const command = new GetSecretValueCommand({
		SecretId: config.SecretId,
	});
	if (config.VersionId) command.input.VersionId = config.VersionId;
	if (config.VersionStage) command.input.VersionStage = config.VersionStage;
	const response = await secretsmanager.send(command);
	return JSON.parse(response.SecretString);
}
