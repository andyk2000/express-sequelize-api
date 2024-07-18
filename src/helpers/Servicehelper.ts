import { logger } from "../../logger";
import { getServiceByStoreID } from "../models/Services";

const getServiceCountByStoreID = async (id: number) => {
  try {
    const services = await getServiceByStoreID(id);
    return services.length;
  } catch (error) {
    logger.error(`Error counting services by storeId: ${id}`, error);
    return 0;
  }
};

export { getServiceCountByStoreID };
