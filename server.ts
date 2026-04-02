import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

    // API Route for sending quote requests to email
  app.post("/api/quote", async (req, res) => {
    const { name, email, product, volume, message } = req.body;

    console.log("--- New Quote Request ---");
    console.log("From:", name, `(${email})`);
    console.log("Product:", product);
    console.log("Volume:", volume);
    console.log("Message:", message);

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error("CRITICAL ERROR: EMAIL_USER or EMAIL_PASS is not set in environment variables.");
      console.log("Please go to Settings -> Secrets and add EMAIL_USER (your gmail) and EMAIL_PASS (your Google App Password).");
      return res.status(200).json({ message: "Success (Email skipped: No credentials)" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"TAJERMY Website" <${user}>`,
      to: "duyphuong7@gmail.com",
      subject: `[TAJERMY] Yêu cầu báo giá mới từ ${name}`,
      text: `
Bạn nhận được một yêu cầu báo giá mới từ website TAJERMY.

THÔNG TIN KHÁCH HÀNG:
--------------------
Họ tên: ${name}
Email: ${email}
Sản phẩm quan tâm: ${product}
Sản lượng dự kiến: ${volume}

NỘI DUNG LIÊN HỆ:
----------------
${message || "(Không có nội dung)"}

---
Đây là email tự động từ hệ thống TAJERMY.
      `,
    };

    try {
      console.log("Attempting to send email to duyphuong7@gmail.com...");
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully! Message ID:", info.messageId);
      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error("ERROR SENDING EMAIL:", error);
      if (error instanceof Error) {
        if (error.message.includes("Invalid login")) {
          console.error("DEBUG: Login failed. This usually means the App Password is incorrect or not set up.");
        }
      }
      res.status(200).json({ message: "Success (Email failed but request logged)" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
