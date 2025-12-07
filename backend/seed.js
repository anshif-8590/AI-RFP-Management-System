import mongoose from "mongoose";
import dotenv from "dotenv";
import Rfp from "./src/models/Rfp.js";
import Vendor from "./src/models/Vendor.js";
import Proposal from "./src/models/Proposal.js";

dotenv.config();

const MONGO = process.env.MONGODB_URI;


const run = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO);
    console.log("Connected!");

    console.log("Clearing old data...");
    await Vendor.deleteMany({});
    await Rfp.deleteMany({});
    await Proposal.deleteMany({});

    console.log("Seeding vendors...");
    const vendors = await Vendor.insertMany([
      { name: "TechWave Solutions", email: "contact@techwave.com" },
      { name: "BrightSoft Technologies", email: "info@brightsoft.com" },
      { name: "Skyline Digital", email: "sales@skylinedigital.com" }
    ]);

    console.log("Seeding RFP...");
    const rfp = await Rfp.create({
      title: "E-Commerce Platform Development",
      description:
        "Need full e-commerce website with payment gateway, admin panel, and order tracking. Delivery expected in 45 days.",
      budget: 350000,
      items: [],
      sentTo: [],
    });

    console.log("Seeding proposals...");
    await Proposal.insertMany([
      {
        rfpId: rfp._id,
        vendorId: vendors[0]._id,
        subject: "RFP Response - E-Commerce",
        fromEmail: "sales@techwave.com",
        rawEmail: "We can deliver the platform in 40 days at ₹3,20,000.",
        price: 320000,
        parsedFields: {
          deliveryDays: 40,
          warranty: "1 year"
        }
      },
      {
        rfpId: rfp._id,
        vendorId: vendors[1]._id,
        subject: "Proposal Submission",
        fromEmail: "info@brightsoft.com",
        rawEmail: "Delivery in 45 days, price ₹3,50,000.",
        price: 350000,
        parsedFields: {
          deliveryDays: 45,
          warranty: "6 months"
        }
      }
    ]);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
