const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fail untuk simpan mesej
const messagesFile = path.join(__dirname, 'messages.json');

// Pastikan fail wujud
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([], null, 2));
}

// Konfigurasi Gmail (ganti dengan awak punya)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rierwebsite@gmail.com',
    pass: process.env.lnnu sllx wuso lkvu  // ← Tukar jadi macam ni je
  }
});
// Route utama untuk terima semua form
app.post('/send-message', async (req, res) => {
  try {
    const data = req.body;
    const date = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });

    // Simpan ke JSON
    const messages = JSON.parse(fs.readFileSync(messagesFile));
    messages.push({
      date: date,
      type: data.formType || 'General Contact',
      ...data
    });
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    // Hantar email ke awak
    await transporter.sendMail({
      from: 'rierwebsite@gmail.com',
      to: 'rierwebsite@gmail.com',
      subject: `New ${data.formType || 'Contact'} from ${data.name || 'Someone'}`,
      html: `
        <h2>Pertanyaan Baru!</h2>
        <p><strong>Tarikh:</strong> ${date}</p>
        <p><strong>Jenis:</strong> ${data.formType || 'General Contact'}</p>
        <p><strong>Nama:</strong> ${data.name || '-'}</p>
        <p><strong>Email:</strong> ${data.email || '-'}</p>
        <p><strong>Telefon:</strong> ${data.phone || '-'}</p>
        <hr>
        <p><strong>Mesej:</strong><br>${data.message || data.description || '-'}</p>
        ${data.project_type ? `<p><strong>Jenis Projek:</strong> ${data.project_type}</p>` : ''}
        ${data.budget ? `<p><strong>Bajet:</strong> ${data.budget}</p>` : ''}
      `
    });

    res.json({ success: true, message: 'Terima kasih! Mesej anda telah dihantar.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal hantar mesej. Sila cuba lagi.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);

});
