type envMode = "development" | "production";

interface BaseConfig {
	mode: envMode;
	port: number;
	pollingTime: number;
}

interface EnvConfig {
	db: {
		path?: string;
		user?: string;
		pass?: string;
	};
}

interface Config extends BaseConfig, EnvConfig {}

const mode: envMode = (process.env.NODE_ENV as envMode) || "development";
const baseConfig: BaseConfig = {
	mode,
	port: Number(process.env.PORT) || 4000,
	pollingTime: Number(process.env.POLLING_TIME) || 60000,
};

const envConfig: Record<envMode, EnvConfig> = {
	development: {
		db: {
			path: process.env.MONGO_PATH_DEV,
			user: process.env.MONGO_USER_DEV,
			pass: process.env.MONGO_PASS_DEV,
		},
	},
	production: {
		db: {
			path: process.env.MONGO_PATH_PROD,
			user: process.env.MONGO_USER_PROD,
			pass: process.env.MONGO_PASS_PROD,
		},
	},
};

const config: Config = {
	...baseConfig,
	...envConfig[mode],
};

export { config };
