// backend/src/utils/emailReceiver.js
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import Proposal from "../models/Proposal.js";
import Rfp from "../models/Rfp.js";
import { parseProposalEmail } from "./ai.js";

/**
 * Extract RFP ID from subject like: "[RFP:65f0c3b8a9e9a8... ] Something"
 */
function extractRfpIdFromSubject(subject = '') {
  const match = subject.match(/\[RFP:([0-9a-fA-F]{24})\]/);
  return match ? match[1] : null;
}

/**
 * Connect to Gmail IMAP inbox → read unread emails → map to RFP → save Proposal
 */
export async function fetchNewProposalsFromInbox() {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_TLS === "true",
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASS,
    },
  });

  const createdProposals = [];

  console.log("Connecting to IMAP…");
  await client.connect();
  await client.mailboxOpen("INBOX");
  console.log("INBOX opened");

  try {
    // ✅ 1) Only search UNSEEN emails that look like RFP replies
    const rfpUids = await client.search({
      seen: false,
      subject: "[RFP:",
    });

    console.log("UNSEEN RFP-like emails:", rfpUids);

    if (!rfpUids || rfpUids.length === 0) {
      console.log("No unseen RFP reply emails found.");
      return [];
    }

    // ✅ 2) Only process the LAST 5 of them
    const recentUids = rfpUids.slice(-5);
    console.log("Processing UIDs:", recentUids);

    for await (const msg of client.fetch(
      recentUids,
      { uid: true, envelope: true, source: true }
    )) {
      const parsed = await simpleParser(msg.source);

      const subject = parsed.subject || "";
      const fromEmail = parsed.from?.text || "";
      const rawEmail = parsed.text || parsed.html || "";

      console.log("Processing email subject:", subject);

      const rfpId = extractRfpIdFromSubject(subject);

      if (!rfpId || !rawEmail) {
        console.log("No RFP id or empty body, marking seen and skipping.");
        await client.messageFlagsAdd({ uid: msg.uid }, ["\\Seen"]);
        continue;
      }

      const rfp = await Rfp.findById(rfpId);
      if (!rfp) {
        console.log("RFP not found for id:", rfpId);
        await client.messageFlagsAdd({ uid: msg.uid }, ["\\Seen"]);
        continue;
      }

      console.log("Calling parseProposalEmail…");
      const aiParsed = await parseProposalEmail(rawEmail);

      const proposal = await Proposal.create({
        rfpId: rfp._id,
        vendorId: null, // reply might not match saved vendor
        fromEmail,
        subject,
        rawEmail,
        parseFields: aiParsed,
        price: aiParsed?.price ?? null,
        terms: aiParsed?.paymentTerms || aiParsed?.notes || null,
        attachments: [],
      });

      console.log("Created proposal with id:", proposal._id.toString());
      createdProposals.push(proposal);

      await client.messageFlagsAdd({ uid: msg.uid }, ["\\Seen"]);

      // ✅ 3) Stop after first successful proposal → super fast
      break;
    }
  } finally {
    console.log("Logging out from IMAP");
    await client.logout();
  }

  console.log("Total proposals created:", createdProposals.length);
  return createdProposals;
}
