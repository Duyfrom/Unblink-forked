import { logger } from "../logger";

export async function check_version(props: { ENGINE_URL: string }) {
    // Check version
    const SUPPORTED_VERSION = "1.0.0";
    // Send /version request to engine with 5 second timeout
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const version_response = await fetch(`https://${props.ENGINE_URL}/version`, {
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (version_response.ok) {
            const version_data = await version_response.json();
            if (version_data.version) {
                logger.info(`Engine version: ${version_data.version}`);
                if (version_data.version !== SUPPORTED_VERSION) {
                    logger.warn(`Warning: Newer engine version available: ${version_data.version}. Supported version is ${SUPPORTED_VERSION}. Please consider updating the server.`);
                    logger.warn(`Visit https://github.com/tri2820/unblink for update instructions.`);
                }
            }
        } else {
            logger.error(`Failed to fetch version from engine: ${version_response.status} ${version_response.statusText}`);
        }
    } catch (error) {
        logger.error({ error }, "Error connecting to Zapdos Labs engine (this is expected if running offline or engine is unavailable)");
    }

}