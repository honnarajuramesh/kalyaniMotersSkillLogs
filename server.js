require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/log", async (req, res) => {
  try {
    const {
      agentId,
      creAgent,
      customerName,
      customerMobile,
      ownLead,
      callType,
      currentBucket,
      movedBucket,
      skill,
    } = req.body;

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:I",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            agentId,
            creAgent,
            new Date().toLocaleString(),
            customerName,
            customerMobile,
            ownLead,
            callType,
            currentBucket,
            movedBucket,
            skill,
          ],
        ],
      },
    });

    res.status(200).json({ message: "Logged to sheet" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
