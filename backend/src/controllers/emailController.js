import { fetchNewProposalsFromInbox } from '../utils/emailReceiver.js';

export const syncInbox = async (req, res) => {
  try {
    const proposals = await fetchNewProposalsFromInbox();
    return res.json({
      message: "Inbox synced successfully",
      count: proposals.length,
      proposals
    });
  } catch (error) {
    console.error("Error syncing inbox:", error);
    return res.status(500).json({
      message: "Failed to sync inbox",
      error: error.message
    });
  }
};
