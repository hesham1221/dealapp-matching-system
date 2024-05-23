import cron from "node-cron";
import PropertyRequest from "../models/PropertyRequest.js";

cron.schedule("0 0 */3 * *", async () => {
  // refresh every 3 days
  try {
    const now = new Date();
    await PropertyRequest.updateMany({}, { refreshedAt: now });

    // We can add more logic according the bussiness logic but it's not specify in the task

    console.log(`Property requests refreshed at ${now}`);
  } catch (error) {
    console.error("Error refreshing property requests:", error);
  }
});
